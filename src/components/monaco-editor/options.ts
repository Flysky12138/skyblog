import { editor } from 'monaco-editor'

/**
 * `monaco-editor` 默认配置
 */
export const monacoEditorDefaultOptions: editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  contextmenu: false,
  fontFamily: 'inherit',
  fontLigatures: false, // 连体字
  fontSize: 14,
  fontWeight: 'bold',
  lineDecorationsWidth: 12,
  lineNumbersMinChars: 4,
  quickSuggestions: {
    comments: true,
    other: true,
    strings: true
  },
  renderLineHighlight: 'all',
  roundedSelection: true,
  scrollbar: {
    alwaysConsumeMouseWheel: true // 默认值；滚动行为 preventDefault() & stopPropagation()
  },
  scrollBeyondLastLine: true,
  smoothScrolling: true
}
