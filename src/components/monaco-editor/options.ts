import { editor } from 'monaco-editor'

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
  hover: {
    above: true
  },
  lineDecorationsWidth: 12,
  lineNumbersMinChars: 4,
  quickSuggestions: {
    comments: 'on',
    other: 'on',
    strings: 'on'
  },
  renderLineHighlight: 'all',
  roundedSelection: true,
  scrollbar: {
    alwaysConsumeMouseWheel: true
  },
  scrollBeyondLastLine: true,
  smoothScrolling: true
}
