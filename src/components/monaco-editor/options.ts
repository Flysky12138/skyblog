import { editor } from 'monaco-editor'
import { BundledLanguage, BundledTheme } from 'shiki'

/**
 * 语言
 */
export const langs = ['javascript', 'typescript', 'markdown', 'yaml'] satisfies BundledLanguage[]

/**
 * 主题
 * @example
 * ['dark-plus', 'light-plus']
 */
export const themes = ['dark-plus', 'light-plus'] satisfies BundledTheme[]

/**
 * `monaco-editor` 默认配置
 */
export const monacoEditorDefaultOptions: editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  contextmenu: false,
  fixedOverflowWidgets: true,
  fontFamily: 'inherit',
  fontLigatures: false, // 连体字
  fontSize: 14,
  fontWeight: 'bold',
  lineDecorationsWidth: 12,
  lineNumbersMinChars: 4,
  renderLineHighlight: 'all',
  roundedSelection: true,
  scrollBeyondLastLine: true,
  smoothScrolling: true,
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
}
