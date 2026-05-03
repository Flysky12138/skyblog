import { toMerged } from 'es-toolkit'
import { editor } from 'monaco-editor'
import { BundledLanguage, BundledTheme } from 'shiki'

/**
 * 语言
 */
export const langs = ['javascript', 'typescript', 'markdown', 'yaml'] as const satisfies BundledLanguage[]

/**
 * 主题
 */
export const themes = ['dark-plus', 'light-plus'] as const satisfies BundledTheme[]

/**
 * `monaco-editor` 初始配置
 */
export const createMonacoEditorInitialOptions = (options: editor.IStandaloneEditorConstructionOptions = {}) => {
  return toMerged(
    {
      automaticLayout: true,
      contextmenu: false,
      fixedOverflowWidgets: true,
      fontFamily: 'inherit',
      fontLigatures: false, // 连体字
      fontSize: 14,
      fontWeight: 'bold',
      insertSpaces: true,
      lineDecorationsWidth: 12,
      lineNumbersMinChars: 4,
      renderLineHighlight: 'all',
      roundedSelection: true,
      scrollBeyondLastLine: true,
      smoothScrolling: true,
      tabSize: 2,
      hover: {
        above: true
      },
      quickSuggestions: {
        comments: 'on',
        other: 'on',
        strings: 'on'
      },
      scrollbar: {
        alwaysConsumeMouseWheel: true
      }
    },
    options
  )
}
