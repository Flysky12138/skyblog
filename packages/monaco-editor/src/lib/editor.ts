import loader from '@monaco-editor/loader'
import { toMerged } from 'es-toolkit'
import { editor } from 'monaco-editor'

/**
 * `monaco-editor` 初始配置
 */
export function createMonacoEditorInitialOptions(options: editor.IStandaloneEditorConstructionOptions = {}) {
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
    } satisfies editor.IStandaloneEditorConstructionOptions,
    options
  )
}

/**
 * 初始化语言
 */
export function initialLanguage2ZhCN(vs: string) {
  if (vs && !vs.endsWith('min/vs')) {
    throw new Error('vs must end with min/vs')
  }

  loader.config({
    paths: {
      vs
    },
    'vs/nls': {
      availableLanguages: {
        '*': 'zh-cn'
      }
    }
  })
}
