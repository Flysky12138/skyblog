'use client'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/cn'
import { DiffEditor, DiffEditorProps, Editor, EditorProps, loader, Monaco } from '@monaco-editor/react'
import 'client-only'
import { toMerged } from 'es-toolkit'
import * as monaco from 'monaco-editor'
import { editor, IDisposable } from 'monaco-editor'
import React from 'react'
import './index.css'
import { monacoEditorDefaultOptions } from './options'

export interface MonacoEditorRef {
  editor: editor.IStandaloneCodeEditor | undefined
  /** 格式化 */
  format: () => Promise<void> | undefined
}
export interface LanguageConfig {
  /** 内容语言 */
  language: 'markdown' | 'yaml' | (string & {})
  /** 注册事件 */
  registerEvents?: (monaco: Monaco) => IDisposable[]
}
interface MonacoEditorProps extends LanguageConfig, Pick<EditorProps, 'loading' | 'className' | 'height' | 'options' | 'onChange'> {
  code: EditorProps['value']
  /**
   * @default false
   */
  diffMode?: boolean
  oldCode: DiffEditorProps['original']
  ref?: React.Ref<MonacoEditorRef>
}

export default function MonacoEditor({
  className,
  diffMode = false,
  code = '',
  oldCode = '',
  ref,
  registerEvents,
  onChange,
  ...props
}: MonacoEditorProps) {
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

/**
 * 设置为从 npm 加载资源
 * 注：从 CDN 加载，可以配置界面汉化
 * @see https://github.com/suren-atoyan/monaco-react?tab=readme-ov-file#loader-config
 */
if (typeof window != 'undefined') {
  window.MonacoEnvironment = {
    getWorker(_, label) {
      switch (label) {
        case 'editorWorkerService':
          return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url))
        case 'css':
        case 'less':
        case 'scss':
          return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url))
        case 'handlebars':
        case 'html':
        case 'razor':
          return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url))
        case 'json':
          return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url))
        case 'javascript':
        case 'typescript':
          return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url))
        case 'yaml':
          return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url))
        default:
          throw new Error(`Unknown label ${label}`)
      }
    }
  }
}
loader.config({ monaco })
