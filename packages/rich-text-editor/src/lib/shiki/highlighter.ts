import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { transformerMetaHighlight, transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'
import { BundledLanguage, BundledTheme, createHighlighter, Highlighter, SpecialLanguage } from 'shiki'

import { transformerLineNumbers } from './transformer-line-numbers'
import { transformerPreserveNotationMarkers } from './transformer-preserve-markers'

export const defaultLightTheme = 'one-light' satisfies BundledTheme
export const defaultDarkTheme = 'one-dark-pro' satisfies BundledTheme
export const defaultLanguage = 'plaintext' satisfies BundledLanguage | SpecialLanguage

let highlighter: Highlighter | null = null
let promise: null | Promise<Highlighter> = null

/**
 * 高亮代码
 */
export async function highlightCode(
  code: string,
  options: {
    lang?: BundledLanguage | SpecialLanguage
    /**
     * 是否保留代码中的标记
     *
     * @default false
     */
    preserveMarkers?: boolean
    /**
     * @default 'classic'
     */
    structure?: 'classic' | 'inline'
    themes: {
      dark?: BundledTheme
      light?: BundledTheme
    }
  }
) {
  const { lang = defaultLanguage, preserveMarkers = false, structure = 'classic', themes = {} } = options

  const h = await getHighlighter()

  themes.light ??= defaultLightTheme
  themes.dark ??= defaultDarkTheme

  // 动态加载语言
  try {
    if (!h.getLoadedLanguages().includes(lang)) {
      await h.loadLanguage(lang)
    }
  } catch {
    // 语言不支持时回退到纯文本
  }

  // 动态加载主题
  const themesToLoad = Object.values(themes).filter(theme => !h.getLoadedThemes().includes(theme))
  if (themesToLoad.length > 0) {
    try {
      await h.loadTheme(...themesToLoad)
    } catch {
      // 主题加载失败时静默处理
    }
  }

  // Shiki 会忽略末尾空行，导致高亮层比编辑层少一行，光标错位。
  // 在末尾追加一个空格让 Shiki 保留这行，视觉上不可见。
  // inline 结构无新行问题，不需要补齐空格。
  const normalizedCode = structure === 'classic' ? `${code} ` : code

  return h.codeToHtml(normalizedCode, {
    defaultColor: false,
    lang,
    structure,
    tabindex: -1,
    themes,
    transformers: [
      // 一个适用于 Shiki 的 VSCode 风格彩色括号转换器
      // https://shiki.tmrs.site/packages/colorized-brackets
      transformerColorizedBrackets(),

      // 保留 notation 标记
      ...(preserveMarkers ? [transformerPreserveNotationMarkers()] : []),
      // 行号
      transformerLineNumbers(),

      // 为 Shiki 设计的常用转换器的集合
      // https://shiki.tmrs.site/packages/transformers
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerMetaHighlight()
    ]
  })
}

/**
 * 创建高亮渲染器
 */
async function getHighlighter() {
  if (highlighter) return highlighter
  if (promise) return promise

  promise = createHighlighter({
    langs: [defaultLanguage],
    themes: [defaultLightTheme, defaultDarkTheme]
  })

  highlighter = await promise
  promise = null

  return highlighter
}
