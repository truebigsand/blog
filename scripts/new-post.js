/**
 * 交互式 / 命令行新建文章脚本
 * 支持两种文件模式：
 *   - 目录模式（默认）：src/content/posts/{slug}/index.md
 *   - 文件模式（--flat）： src/content/posts/{slug}.md
 *
 * 用法：
 *   npm run new-post                          # 交互模式
 *   npm run new-post -- --title "标题" ...     # CLI 模式
 *   npm run new-post -- -h                     # 帮助
 */

import fs from "fs"
import path from "path"
import { createInterface } from "readline"
import { fileURLToPath } from "url"
import { pinyin } from "pinyin-pro"

// ---------------------------------------------------------------------------
// 常量
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TARGET_DIR = path.resolve(__dirname, "..", "src", "content", "posts")

const KNOWN_CATEGORIES = ["日常", "技术", "数学", "寄青年"]

// 所有 schema 字段及其默认值（对齐 src/content.config.ts）
const DEFAULTS = {
  title: null,         // 必填，无默认值
  published: null,     // 自动设为今天
  updated: null,
  draft: false,
  description: "",
  image: "",
  tags: [],
  category: "",
  lang: "",
  pinned: false,
  author: "",
  sourceLink: "",
  licenseName: "",
  licenseUrl: "",
  comment: true,
  password: "",
  passwordHint: "",
}

// ---------------------------------------------------------------------------
// 工具函数
// ---------------------------------------------------------------------------

/** 返回今天的 YYYY-MM-DD 字符串 */
function getDate() {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, "0")
  const d = String(today.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** 将标题转为 URL 友好的 slug（中文自动转拼音） */
function toSlug(title) {
  // 检测是否包含中文
  const hasChinese = /[一-鿿]/.test(title)

  let base
  if (hasChinese) {
    // 用 pinyin-pro 转拼音（无音调，空格分隔）
    base = pinyin(title, { toneType: "none", type: "array" }).join(" ")
  } else {
    base = title
  }

  // slugify：转小写，替换非法字符为连字符，合并多余连字符
  return base
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // 去掉非字母数字空格连字符
    .replace(/[\s_]+/g, "-")        // 空格/下划线 → 连字符
    .replace(/-+/g, "-")            // 合并连字符
    .replace(/^-|-$/g, "")          // 去掉首尾连字符
    .replace(/\./g, "-")            // 点号 → 连字符
}

// ---------------------------------------------------------------------------
// 帮助信息
// ---------------------------------------------------------------------------

function showHelp() {
  console.log(`
  📝 新建文章脚本

  用法:
    npm run new-post                             交互模式
    npm run new-post -- [options]                 命令行模式

  选项:
    --title <string>        文章标题（必填；也可作为第一个位置参数）
    --slug <string>         文章 slug（默认从标题自动生成拼音）
    --category <string>     分类（常用：日常 / 技术 / 数学 / 寄青年）
    --tags <tag1,tag2,...>  标签（逗号分隔）
    --description <string>  文章描述
    --image <url>           封面图 URL
    --lang <string>         语言
    --author <string>       作者
    --date <YYYY-MM-DD>     发布日期（默认今天）
    --draft                 标记为草稿
    --pinned                置顶文章
    --no-comment            关闭评论
    --flat                  创建单文件模式（{slug}.md），默认目录模式（{slug}/index.md）
    --sourceLink <url>      原文链接
    --licenseName <string>  许可证名称
    --licenseUrl <url>      许可证 URL
    --password <string>     文章密码
    --passwordHint <string> 密码提示
    -h, --help              显示此帮助
`)
}

// ---------------------------------------------------------------------------
// 命令行参数解析
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const result = { ...DEFAULTS }
  const positional = []

  let i = 0
  while (i < argv.length) {
    const arg = argv[i]

    switch (arg) {
      case "-h":
      case "--help":
        result.help = true
        break

      case "--title":       result.title = argv[++i] ?? ""; break
      case "--slug":        result.slug = argv[++i] ?? ""; break
      case "--category":    result.category = argv[++i] ?? ""; break
      case "--tags":        result.tags = argv[++i] ?? ""; break
      case "--description": result.description = argv[++i] ?? ""; break
      case "--image":       result.image = argv[++i] ?? ""; break
      case "--lang":        result.lang = argv[++i] ?? ""; break
      case "--author":      result.author = argv[++i] ?? ""; break
      case "--date":        result.published = argv[++i] ?? ""; break
      case "--sourceLink":  result.sourceLink = argv[++i] ?? ""; break
      case "--licenseName": result.licenseName = argv[++i] ?? ""; break
      case "--licenseUrl":  result.licenseUrl = argv[++i] ?? ""; break
      case "--password":    result.password = argv[++i] ?? ""; break
      case "--passwordHint":result.passwordHint = argv[++i] ?? ""; break

      case "--draft":       result.draft = true; break
      case "--pinned":      result.pinned = true; break
      case "--no-comment":  result.comment = false; break
      case "--flat":        result.flat = true; break

      default:
        if (!arg.startsWith("-")) {
          positional.push(arg)
        }
    }
    i++
  }

  // 第一个位置参数作为 title
  if (!result.title && positional.length > 0) {
    result.title = positional[0]
  }

  return result
}

// ---------------------------------------------------------------------------
// Frontmatter 生成
// ---------------------------------------------------------------------------

/** 将逗号分隔的标签字符串转为 YAML 数组行 */
function formatTags(tags) {
  if (!tags || tags.length === 0) return null
  // 支持逗号分隔的字符串或已经是数组
  const list = Array.isArray(tags) ? tags : tags.split(/[,，]/).map(s => s.trim()).filter(Boolean)
  if (list.length === 0) return null
  return list.map(t => `  - ${t}`).join("\n")
}

/** 判断值是否为"默认值"（不应写入 frontmatter） */
function isDefault(key, value) {
  const d = DEFAULTS[key]
  if (d === null) return false
  if (Array.isArray(d) && Array.isArray(value)) return value.length === 0
  return value === d
}

/** 从字段对象生成 YAML frontmatter 字符串 */
function buildFrontmatter(fields) {
  const lines = ["---"]

  // title 必填，始终在最前面
  lines.push(`title: ${escapeYamlValue(fields.title)}`)

  // published 必填
  const pub = fields.published || getDate()
  lines.push(`published: ${pub}`)

  // updated（仅非 null 时输出）
  if (fields.updated) {
    lines.push(`updated: ${fields.updated}`)
  }

  // category
  if (fields.category && !isDefault("category", fields.category)) {
    lines.push(`category: ${fields.category}`)
  }

  // tags（YAML 数组格式）
  const tagsBlock = formatTags(fields.tags)
  if (tagsBlock) {
    lines.push("tags:")
    lines.push(tagsBlock)
  }

  // 其余可选字段（仅输出非默认值）
  const optionalFields = [
    "description", "image", "lang", "draft", "pinned",
    "author", "sourceLink", "licenseName", "licenseUrl",
    "comment", "password", "passwordHint",
  ]

  for (const key of optionalFields) {
    const val = fields[key]
    if (val != null && !isDefault(key, val)) {
      if (typeof val === "boolean" || typeof val === "number") {
        lines.push(`${key}: ${val}`)
      } else if (typeof val === "string" && val.includes(":")) {
        // URL 等含冒号的值需要引号包裹
        lines.push(`${key}: "${val}"`)
      } else {
        lines.push(`${key}: ${val}`)
      }
    }
  }

  lines.push("---")
  lines.push("")  // 末尾空行
  return lines.join("\n")
}

/** 必要时给 YAML 字符串值加引号 */
function escapeYamlValue(val) {
  if (typeof val !== "string") return val
  // 包含特殊字符时用双引号包裹
  if (/[:\#\{\}\[\],&*?|><=!%@`'"]/.test(val) || val.startsWith("- ")) {
    return `"${val.replace(/"/g, '\\"')}"`
  }
  return val
}

// ---------------------------------------------------------------------------
// 交互模式（readline）
// ---------------------------------------------------------------------------

function createPrompt() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return (question) => new Promise(resolve => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

async function interactiveMode() {
  const ask = createPrompt()

  console.log("\n📝 新建文章\n" + "─".repeat(40) + "\n")

  // 1. 标题
  let title = ""
  while (!title) {
    title = await ask("  标题（必填）: ")
    if (!title) console.log("  ⚠️  标题不能为空\n")
  }

  // 2. Slug（自动生成，允许修改）
  const autoSlug = toSlug(title)
  const slug = (await ask(`  Slug [${autoSlug}]: `)) || autoSlug

  // 3. 文件模式
  console.log("\n  文件模式：")
  console.log("    1) 目录模式（推荐）→ posts/{slug}/index.md")
  console.log("    2) 文件模式          → posts/{slug}.md")
  const modeInput = await ask("  请选择 [1]: ")
  const flat = modeInput === "2"

  // 4. 分类
  console.log("\n  常用分类：")
  KNOWN_CATEGORIES.forEach((c, i) => console.log(`    ${i + 1}) ${c}`))
  console.log("    0) 不设置 / 自定义")
  const catInput = await ask("  选择或输入自定义分类: ")
  let category = ""
  const catIndex = Number.parseInt(catInput)
  if (!Number.isNaN(catIndex) && catIndex >= 1 && catIndex <= KNOWN_CATEGORIES.length) {
    category = KNOWN_CATEGORIES[catIndex - 1]
  } else if (catIndex !== 0) {
    category = catInput
  }

  // 5. 标签（逗号分隔）
  const tagsInput = await ask("  标签（逗号分隔，可留空）: ")
  const tags = tagsInput || ""

  // 6. 封面图
  const image = await ask("  封面图 URL（可留空）: ")

  // 7. 草稿
  const draftInput = (await ask("  设为草稿？(y/N): ")).toLowerCase()
  const draft = draftInput === "y" || draftInput === "yes"

  // 8. 发布日期（可选自定义）
  const pubDate = (await ask(`  发布日期 [${getDate()}]: `)) || null

  console.log("\n" + "─".repeat(40) + "\n")

  return { title, slug, flat, category, tags, image, draft, published: pubDate }
}

// ---------------------------------------------------------------------------
// 文件创建
// ---------------------------------------------------------------------------

function createPost(fields) {
  const slug = fields.slug
  if (!slug) {
    console.error("❌ 错误：slug 不能为空")
    process.exit(1)
  }

  let filePath
  if (fields.flat) {
    filePath = path.join(TARGET_DIR, `${slug}.md`)
    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
      console.error(`❌ 错误：文件已存在 → ${filePath}`)
      process.exit(1)
    }
    // 确保不创建多余目录（只确保父目录存在）
    fs.mkdirSync(TARGET_DIR, { recursive: true })
  } else {
    const dirPath = path.join(TARGET_DIR, slug)
    filePath = path.join(dirPath, "index.md")
    if (fs.existsSync(filePath)) {
      console.error(`❌ 错误：文件已存在 → ${filePath}`)
      process.exit(1)
    }
    fs.mkdirSync(dirPath, { recursive: true })
  }

  const frontmatter = buildFrontmatter(fields)
  fs.writeFileSync(filePath, frontmatter, "utf-8")

  console.log(`✅ 文章已创建 → ${path.relative(process.cwd(), filePath)}`)
  return filePath
}

// ---------------------------------------------------------------------------
// 主入口
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2)

  // 无参数 → 交互模式
  if (args.length === 0) {
    const fields = await interactiveMode()
    createPost(fields)
    return
  }

  // 有参数 → CLI 模式
  const opts = parseArgs(args)

  if (opts.help) {
    showHelp()
    return
  }

  if (!opts.title) {
    console.error("❌ 错误：必须提供文章标题\n使用 -h 查看帮助")
    process.exit(1)
  }

  // 生成 slug（若未指定）
  if (!opts.slug) {
    opts.slug = toSlug(opts.title)
  }

  createPost(opts)
}

main().catch(err => {
  console.error("❌ 发生错误:", err.message)
  process.exit(1)
})
