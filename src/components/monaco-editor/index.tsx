'use client'

import { DiffEditor, DiffEditorProps, Editor, EditorProps, loader, Monaco } from '@monaco-editor/react'
import { isBrowser, toMerged } from 'es-toolkit'
import { editor, IDisposable } from 'monaco-editor'
import React from 'react'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

import './index.css'
import { monacoEditorDefaultOptions } from './options'

export interface LanguageConfig {
  /** 内容语言 */
  language: 'markdown' | 'yaml' | (string & {})
  /** 注册事件 */
  registerEvents?: (monaco: Monaco) => IDisposable[]
}
export interface MonacoEditorRef {
  editor: editor.IStandaloneCodeEditor | undefined
  /** 格式化 */
  format: () => Promise<void> | undefined
}
interface MonacoEditorProps extends LanguageConfig, Pick<EditorProps, 'className' | 'height' | 'loading' | 'onChange' | 'options'> {
  code: EditorProps['value']
  /**
   * @default false
   */
  diffMode?: boolean
  oldCode?: DiffEditorProps['original']
  ref?: React.Ref<MonacoEditorRef>
}

export const MonacoEditor = ({
  className,
  code = '',
  diffMode = false,
  oldCode = '',
  ref,
  registerEvents,
  onChange,
  ...props
}: MonacoEditorProps) => {
  props.options = toMerged(monacoEditorDefaultOptions, props.options || {})
  props.loading ||= '加载中...'

  // 主题
  const { isDark } = useTheme()
  const theme = isDark ? 'vs-dark' : 'vs'

  // 取消注册内容事件列表
  const iDisposables = React.useRef<IDisposable[]>([])
  React.useEffect(() => {
    return () => iDisposables.current.forEach(it => it.dispose())
  }, [diffMode])

  const editorRef = React.useRef<editor.IStandaloneCodeEditor>(undefined)
  React.useImperativeHandle(ref, () => ({
    editor: editorRef.current,
    format: () => editorRef.current?.getAction('editor.action.formatDocument')?.run()
  }))

  return (
    <section
      aria-label="Monaco Editor"
      className={cn('h-full overflow-hidden', className)}
      onKeyDown={event => {
        if (event.key == 's' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault()
        }
      }}
    >
      <DisplayByConditional
        condition={!diffMode}
        fallback={
          <DiffEditor
            key={1}
            beforeMount={monaco => {
              iDisposables.current = registerEvents?.(monaco) || []
            }}
            modified={code}
            original={oldCode}
            theme={theme}
            {...props}
          />
        }
      >
        <Editor
          key={2}
          beforeMount={monaco => {
            iDisposables.current = registerEvents?.(monaco) || []
          }}
          theme={theme}
          value={code}
          onChange={onChange}
          onMount={editor => {
            editorRef.current = editor
          }}
          {...props}
        />
      </DisplayByConditional>
    </section>
  )
}

loader.config({
  paths: {
    vs: process.env.NEXT_PUBLIC_CDN_MONACO_EDITOR + 'min/vs'
  },
  'vs/nls': {
    availableLanguages: {
      '*': 'zh-cn'
    }
  }
})

if (isBrowser()) {
  window.MonacoEnvironment = {
    // @ts-ignore
    getWorker(_, label) {
      switch (label) {
        case 'yaml':
          return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url))
        // default:
        //   return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url))
      }
    }
  }
}
