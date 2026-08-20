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
 *
 * 设计说明：所有 schema 字段由下方 FIELDS 表统一声明——
 * 参数解析、frontmatter 生成、帮助文本、交互提示全部由它驱动，
 * 新增字段只需在表中加一行。
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
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// ---------------------------------------------------------------------------
// 字段表（唯一事实来源）
// ---------------------------------------------------------------------------
// type:
//   "string"  —— CLI 需跟一个参数值
//   "boolean" —— CLI 标志，默认值 false（negate 字段标志取反）
//   "array"   —— CLI 跟逗号分隔字符串，解析为数组
//   "date"    —— CLI 跟 YYYY-MM-DD，自动校验格式
// 其他说明:
//   required —— 必填（title）
//   advanced —— 只在交互模式的二级菜单中询问
//   flag     —— CLI 标志（与字段 key 可能不同名，如 --date → published）
//   negate   —— 标志为取反语义（--no-comment → comment: false）

const FIELDS = [
  { key: "title",        label: "标题",        type: "string",  required: true, flag: "--title <string>",        help: "文章标题（必填；也可作为第一个位置参数）" },
  { key: "published",    label: "发布日期",    type: "date",    flag: "--date <YYYY-MM-DD>",                 help: "发布日期（默认今天）" },
  { key: "updated",      label: "更新日期",    type: "date",    advanced: true, flag: "--updated <YYYY-MM-DD>",  help: "更新日期" },
  { key: "category",     label: "分类",        type: "string",  default: "",    flag: "--category <string>",     help: "分类（常用：日常 / 技术 / 数学 / 寄青年）" },
  { key: "tags",         label: "标签",        type: "array",   default: [],    flag: "--tags <tag1,tag2>",      help: "标签（逗号分隔）" },
  { key: "image",        label: "封面图 URL",  type: "string",  default: "",    flag: "--image <url>",           help: "封面图 URL" },
  { key: "description",  label: "描述",        type: "string",  default: "",    advanced: true, flag: "--description <string>", help: "文章描述" },
  { key: "lang",         label: "语言",        type: "string",  default: "",    advanced: true, flag: "--lang <string>",          help: "语言（如 zh-CN）" },
  { key: "draft",        label: "草稿",        type: "boolean", default: false, flag: "--draft",                 help: "标记为草稿" },
  { key: "pinned",       label: "置顶",        type: "boolean", default: false, advanced: true, flag: "--pinned",               help: "置顶文章" },
  { key: "author",       label: "作者",        type: "string",  default: "",    advanced: true, flag: "--author <string>",       help: "作者" },
  { key: "sourceLink",   label: "原文链接",    type: "string",  default: "",    advanced: true, flag: "--sourceLink <url>",       help: "原文链接" },
  { key: "licenseName",  label: "许可证名称",  type: "string",  default: "",    advanced: true, flag: "--licenseName <string>",   help: "许可证名称" },
  { key: "licenseUrl",   label: "许可证 URL",  type: "string",  default: "",    advanced: true, flag: "--licenseUrl <url>",       help: "许可证 URL" },
  { key: "comment",      label: "关闭评论",    type: "boolean", default: true,  advanced: true, flag: "--no-comment", negate: true, help: "关闭评论" },
  { key: "password",     label: "文章密码",    type: "string",  default: "",    advanced: true, flag: "--password <string>",      help: "文章密码" },
  { key: "passwordHint", label: "密码提示",    type: "string",  default: "",    advanced: true, flag: "--passwordHint <string>",  help: "密码提示" },
]

// 创建选项（非 schema 字段，不写入 frontmatter）
const OPTIONS = [
  { key: "slug", label: "Slug",     type: "string",  flag: "--slug <string>", help: "文章 slug（默认从标题自动生成拼音）" },
  { key: "flat", label: "文件模式", type: "boolean", flag: "--flat",           help: "创建单文件模式（{slug}.md），默认目录模式（{slug}/index.md）" },
]

const ALL_DEFS = [...FIELDS, ...OPTIONS]

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

  // slugify：点号先转连字符（如 v1.2.3 → v1-2-3），再删除其余非法字符
  return base
    .toLowerCase()
    .replace(/\./g, "-")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/** 校验日期格式，非法时抛错 */
function validateDate(value, label) {
  if (!DATE_RE.test(value)) {
    throw new Error(`${label}格式无效：${value}（应为 YYYY-MM-DD）`)
  }
}

// ---------------------------------------------------------------------------
// 命令行参数解析（由 FIELDS 表驱动）
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const result = {}
  const positional = []

  let i = 0
  while (i < argv.length) {
    const arg = argv[i]

    if (arg === "-h" || arg === "--help") {
      result.help = true
      i++
      continue
    }

    // flag 形如 "--title <string>"，匹配时只取标志本身
    const def = ALL_DEFS.find(d => d.flag.split(/\s+/)[0] === arg)
    if (def) {
      if (def.type === "boolean") {
        result[def.key] = def.negate ? false : true
      } else {
        const raw = argv[++i] ?? ""
        if (def.type === "array") {
          result[def.key] = raw.split(/[,，]/).map(s => s.trim()).filter(Boolean)
        } else {
          result[def.key] = raw
        }
        if (def.type === "date" && raw) {
          validateDate(raw, def.label)
        }
      }
      i++
      continue
    }

    // 未知选项直接报错，避免拼写错误被静默忽略
    if (arg.startsWith("-")) {
      throw new Error(`未知参数：${arg}（使用 -h 查看帮助）`)
    }
    positional.push(arg)
    i++
  }

  // 第一个位置参数作为 title
  if (!result.title && positional.length > 0) {
    result.title = positional[0]
  }

  return result
}

// ---------------------------------------------------------------------------
// Frontmatter 生成（由 FIELDS 表驱动）
// ---------------------------------------------------------------------------

/** 必要时给 YAML 字符串值加引号 */
function escapeYamlValue(val) {
  if (typeof val !== "string") return val
  if (/[:\#\{\}\[\],&*?|><=!%@`'"]/.test(val) || val.startsWith("- ")) {
    return `"${val.replace(/"/g, '\\"')}"`
  }
  return val
}

/** 从字段对象生成 YAML frontmatter 字符串（仅输出非默认值） */
function buildFrontmatter(fields) {
  const lines = ["---"]

  // title 必填，始终在最前面
  lines.push(`title: ${escapeYamlValue(fields.title)}`)

  // published 必填（默认今天）
  lines.push(`published: ${fields.published || getDate()}`)

  for (const def of FIELDS) {
    if (def.key === "title" || def.key === "published") continue

    const val = fields[def.key]
    if (val == null) continue

    if (def.type === "boolean") {
      if (val === (def.default ?? false)) continue
      lines.push(`${def.key}: ${val}`)
    } else if (def.type === "array") {
      if (val.length === 0) continue
      lines.push(`${def.key}:`)
      for (const item of val) lines.push(`  - ${item}`)
    } else {
      // string / date
      if (def.default !== undefined && val === def.default) continue
      lines.push(`${def.key}: ${escapeYamlValue(val)}`)
    }
  }

  lines.push("---")
  lines.push("")  // 末尾空行
  return lines.join("\n")
}

// ---------------------------------------------------------------------------
// 帮助信息（由 FIELDS 表驱动）
// ---------------------------------------------------------------------------

function showHelp() {
  const lines = [
    "📝 新建文章脚本",
    "",
    "用法:",
    "  npm run new-post                             交互模式",
    "  npm run new-post -- [options]                 命令行模式",
    "",
    "选项:",
  ]

  for (const def of ALL_DEFS) {
    lines.push(`  ${def.flag.padEnd(26)} ${def.help}`)
  }
  lines.push(`  ${"-h, --help".padEnd(26)} 显示此帮助`)

  console.log("\n" + lines.join("\n") + "\n")
}

// ---------------------------------------------------------------------------
// 交互模式（readline）
// ---------------------------------------------------------------------------

/**
 * 基于 'line' 事件的提问器。
 *
 * 不用 rl.question：在 `node file.mjs` + 非 TTY（管道/重定向）下，
 * question 第二次调用会挂起（Node 26 环境实测）。line 事件 + 队列
 * 在 TTY / 管道 / 重定向下均可靠，且支持预输入缓冲。
 */
function createPrompt() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const queue = []
  let pendingResolve = null
  let eof = false

  rl.on("line", (line) => {
    if (pendingResolve) {
      const resolve = pendingResolve
      pendingResolve = null
      resolve(line.trim())
    } else {
      queue.push(line.trim())
    }
  })
  rl.on("close", () => {
    eof = true
    // 若 EOF 时仍有挂起的提问，以空串收尾，避免 promise 永不 settle
    if (pendingResolve) {
      const resolve = pendingResolve
      pendingResolve = null
      resolve("")
    }
  })

  const ask = (question) => new Promise(resolve => {
    process.stdout.write(question)
    if (queue.length > 0) {
      resolve(queue.shift())
    } else if (eof) {
      resolve("")
    } else {
      pendingResolve = resolve
    }
  })

  return { ask, close: () => rl.close(), eof: () => eof }
}

/** 询问高级字段（二级菜单），所有字段可回车跳过 */
async function askAdvancedFields(ask, fields) {
  console.log("\n  ⚙️  高级字段（回车跳过）")

  for (const def of FIELDS.filter(f => f.advanced)) {
    if (def.type === "boolean") {
      const input = (await ask(`  ${def.label}？(y/N): `)).toLowerCase()
      const yes = input === "y" || input === "yes"
      if (yes) fields[def.key] = def.negate ? !def.default : true
    } else {
      const input = await ask(`  ${def.label}（可留空）: `)
      if (!input) continue
      if (def.type === "date") validateDate(input, def.label)
      if (def.type === "array") {
        fields[def.key] = input.split(/[,，]/).map(s => s.trim()).filter(Boolean)
      } else {
        fields[def.key] = input
      }
    }
  }
}

async function interactiveMode() {
  const prompt = createPrompt()
  const { ask, close, eof } = prompt
  const fields = {}

  try {
    console.log("\n📝 新建文章\n" + "─".repeat(40) + "\n")

    // 1. 标题（必填）
    let title = ""
    while (!title) {
      title = await ask("  标题（必填）: ")
      if (!title) {
        if (eof()) throw new Error("输入已结束，未提供文章标题")
        console.log("  ⚠️  标题不能为空\n")
      }
    }
    fields.title = title

    // 2. Slug（自动生成，允许修改）
    const autoSlug = toSlug(title)
    if (autoSlug) {
      fields.slug = (await ask(`  Slug [${autoSlug}]: `)) || autoSlug
    } else {
      let slug = ""
      while (!slug) {
        slug = await ask("  Slug（必填，标题中无可用字符）: ")
        if (!slug && eof()) throw new Error("输入已结束，未提供 slug")
      }
      fields.slug = slug
    }

    // 3. 文件模式
    console.log("\n  文件模式：")
    console.log("    1) 目录模式（推荐）→ posts/{slug}/index.md")
    console.log("    2) 文件模式          → posts/{slug}.md")
    const modeInput = await ask("  请选择 [1]: ")
    fields.flat = modeInput === "2"

    // 4. 分类
    console.log("\n  常用分类：")
    KNOWN_CATEGORIES.forEach((c, i) => console.log(`    ${i + 1}) ${c}`))
    console.log("    0) 不设置")
    const catInput = await ask("  选择或输入自定义分类: ")
    if (/^\d+$/.test(catInput)) {
      // 纯数字 → 只接受已知分类的下标
      const catNum = Number.parseInt(catInput, 10)
      if (catNum >= 1 && catNum <= KNOWN_CATEGORIES.length) {
        fields.category = KNOWN_CATEGORIES[catNum - 1]
      } else if (catNum !== 0) {
        console.log(`  ⚠️  无效选项 ${catInput}，分类不设置`)
      }
    } else if (catInput) {
      // 其余文本视为自定义分类
      fields.category = catInput
    }

    // 5. 标签（逗号分隔）
    const tagsInput = await ask("  标签（逗号分隔，可留空）: ")
    fields.tags = tagsInput.split(/[,，]/).map(s => s.trim()).filter(Boolean)

    // 6. 封面图
    const image = await ask("  封面图 URL（可留空）: ")
    if (image) fields.image = image

    // 7. 草稿
    const draftInput = (await ask("  设为草稿？(y/N): ")).toLowerCase()
    fields.draft = draftInput === "y" || draftInput === "yes"

    // 8. 发布日期（可选自定义）
    const pubDate = await ask(`  发布日期 [${getDate()}]: `)
    if (pubDate) {
      validateDate(pubDate, "发布日期")
      fields.published = pubDate
    }

    // 9. 高级字段二级菜单
    const advancedInput = (await ask("\n  是否配置高级字段（置顶/关闭评论/密码等）？(y/N): ")).toLowerCase()
    if (advancedInput === "y" || advancedInput === "yes") {
      await askAdvancedFields(ask, fields)
    }

    console.log("\n" + "─".repeat(40) + "\n")
    return fields
  } finally {
    // 无论成功还是出错都必须关闭 readline，否则进程不会退出
    close()
  }
}

// ---------------------------------------------------------------------------
// 文件创建
// ---------------------------------------------------------------------------

function createPost(fields) {
  const slug = fields.slug
  if (!slug) {
    throw new Error("slug 不能为空：标题中缺少可用的字母/数字字符")
  }

  const filePath = fields.flat
    ? path.join(TARGET_DIR, `${slug}.md`)
    : path.join(TARGET_DIR, slug, "index.md")

  if (fs.existsSync(filePath)) {
    throw new Error(`文件已存在 → ${filePath}`)
  }

  const parentDir = path.dirname(filePath)
  fs.mkdirSync(parentDir, { recursive: true })
  fs.writeFileSync(filePath, buildFrontmatter(fields), "utf-8")

  console.log(`✅ 文章已创建 → ${path.relative(process.cwd(), filePath)}`)
  return filePath
}

// ---------------------------------------------------------------------------
// 主入口
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2)

  // 无参数 → 交互模式
  if (args.length === 0) {
    return interactiveMode().then(fields => createPost(fields))
  }

  // 有参数 → CLI 模式
  const opts = parseArgs(args)

  if (opts.help) {
    showHelp()
    return
  }

  if (!opts.title || !opts.title.trim()) {
    throw new Error("必须提供文章标题（使用 -h 查看帮助）")
  }
  opts.title = opts.title.trim()

  // 生成 slug（若未指定）
  if (!opts.slug) {
    opts.slug = toSlug(opts.title)
  }

  createPost(opts)
}

// Promise.resolve 包裹：兼容 main 的同步抛错与异步返回
Promise.resolve(main()).catch(err => {
  console.error(`❌ 错误：${err.message}`)
  process.exit(1)
})
