/**
 * Vite 插件：将 src/content/posts/ 下非 .md/.mdx 文件复制到构建输出
 *
 * Astro content collection 的 glob loader 只处理 markdown 文件，
 * 同目录下的附件（.zip、.rar、images/ 等）在构建时会被忽略。
 * 此插件在 bundle 写入后将这些文件复制到 dist/posts/ 对应路径，
 * 使得文章中的相对路径引用（如 ./file.zip）正常工作。
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs"
import { dirname, join, relative, resolve } from "path"

const POSTS_DIR = resolve("src/content/posts")

/** 递归获取目录下所有非 .md/.mdx 文件 */
function getAssetFiles(dir, baseDir = dir) {
	const files = []
	const entries = readdirSync(dir, { withFileTypes: true })
	for (const entry of entries) {
		// 跳过隐藏文件
		if (entry.name.startsWith(".")) continue
		const fullPath = join(dir, entry.name)
		if (entry.isDirectory()) {
			files.push(...getAssetFiles(fullPath, baseDir))
		} else if (!/\.(md|mdx)$/i.test(entry.name)) {
			files.push(relative(baseDir, fullPath))
		}
	}
	return files
}

export function copyPostAssets() {
	let outDir

	return {
		name: "copy-post-assets",
		apply: "build",

		configResolved(config) {
			outDir = config.build.outDir
		},

		writeBundle() {
			if (!existsSync(POSTS_DIR)) return

			const assetFiles = getAssetFiles(POSTS_DIR)
			let copied = 0

			for (const file of assetFiles) {
				const src = join(POSTS_DIR, file)
				const dest = join(outDir, "posts", file)

				if (!existsSync(dirname(dest))) {
					mkdirSync(dirname(dest), { recursive: true })
				}
				copyFileSync(src, dest)
				copied++
			}

			if (copied > 0) {
				console.log(`  📎 已复制 ${copied} 个文章附件到 dist/posts/`)
			}
		},
	}
}
