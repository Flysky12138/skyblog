'use client'

import './index.css'

import loader, { Monaco } from '@monaco-editor/loader'
import { shikiToMonaco } from '@shikijs/monaco'
import { once } from 'es-toolkit'
import { editor, IDisposable } from 'monaco-editor'
import React from 'react'
import { createHighlighter } from 'shiki'

import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

import { createMonacoEditorInitialOptions, langs, themes } from './options'

export interface LanguageConfig {
  /** 内容语言 */
  language: (typeof langs)[number]
  /** 注册事件 */
  registerEvents?: (monaco: Monaco) => IDisposable[]
}

export interface MonacoEditorRef {
  editor?: editor.IStandaloneCodeEditor
  /** 格式化 */
  format: () => Promise<void> | undefined
}

interface MonacoEditorProps extends ElementPropsWithoutEvents<HTMLDivElement>, LanguageConfig {
  className?: string
  /** 是否为对比模式 */
  isDiffMode?: boolean
  options?: Omit<editor.IStandaloneEditorConstructionOptions, 'language' | 'theme' | 'value'>
  originalValue?: string
  ref?: React.RefObject<MonacoEditorRef | null>
  /** 是否禁用默认样式 */
  unstyled?: boolean
  value?: string
  onChange?: (value: string) => void
}

export function MonacoEditor({
  className,
  isDiffMode,
  language,
  options = {},
  originalValue = '',
  ref,
  registerEvents,
  unstyled,
  value = '',
  onChange,
  ...props
}: MonacoEditorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const monacoRef = React.useRef<Monaco>(undefined)
  const editorRef = React.useRef<editor.IStandaloneCodeEditor>(undefined)
  const diffEditorRef = React.useRef<editor.IStandaloneDiffEditor>(undefined)

  const [isMounted, setIsMounted] = React.useState(false)

  // 主题
  const { isDark } = useTheme()
  const theme = themes[isDark ? 0 : 1]

  // 配置
  const _options = React.useMemo(() => createMonacoEditorInitialOptions({ ...options, language, theme }), [language, options, theme])

  // 销毁编辑器
  const destroyMonacoEditor = React.useEffectEvent(() => {
    editorRef.current?.dispose()
    diffEditorRef.current?.dispose()
  })
  // 创建编辑器
  const createMonacoEditor = React.useEffectEvent((monaco?: Monaco) => {
    if (!containerRef.current) {
      console.warn('Monaco Editor root element not found')
      return
    }
    if (!monaco) return

    destroyMonacoEditor()

    if (isDiffMode) {
      diffEditorRef.current = monaco.editor.createDiffEditor(containerRef.current, _options)
      diffEditorRef.current!.setModel({
        modified: monaco.editor.createModel(value, language),
        original: monaco.editor.createModel(originalValue, language)
      })
    } else {
      editorRef.current = monaco.editor.create(containerRef.current, _options)
      editorRef.current!.setModel(monaco.editor.createModel(value, language))
    }

    editorRef.current?.onDidChangeModelContent(() => {
      const val = editorRef.current!.getValue()
      onChange?.(val)
    })
  })

  // 取消注册内容事件列表
  const [iDisposables, setIDisposables] = React.useState<IDisposable[]>([])
  React.useEffect(() => {
    return () => iDisposables.forEach(it => it.dispose())
  }, [iDisposables])

  // 初始化
  React.useEffect(() => {
    loader.init().then(async monaco => {
      monacoRef.current = monaco

      setIDisposables(registerEvents?.(monaco) ?? [])

      const highlighter = await createHighlighterOnce({ langs, themes })
      langs.forEach(id => monaco.languages.register({ id }))
      shikiToMonaco(highlighter, monaco)

      createMonacoEditor(monaco)

      setIsMounted(true)
    })

    return destroyMonacoEditor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 配置更新
  React.useEffect(() => {
    isDiffMode ? diffEditorRef.current?.updateOptions(_options) : editorRef.current?.updateOptions(_options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_options])

  // 切换编辑器
  React.useEffect(() => {
    createMonacoEditor(monacoRef.current)
  }, [isDiffMode])

  // 内容监听
  React.useEffect(() => {
    if (isDiffMode) {
      if (!diffEditorRef.current) return
      if (originalValue != diffEditorRef.current.getModel()?.original.getValue()) {
        diffEditorRef.current.getModel()?.original.setValue(originalValue)
      }
      if (value != diffEditorRef.current.getModel()?.modified.getValue()) {
        diffEditorRef.current.getModel()?.modified.setValue(value)
      }
    } else {
      if (!editorRef.current) return
      if (value != editorRef.current.getValue()) {
        editorRef.current.setValue(value)
      }
    }
  }, [isDiffMode, originalValue, value])

  // 抛出属性
  React.useImperativeHandle(ref, () => ({
    editor: editorRef.current,
    format: () => editorRef.current?.getAction('editor.action.formatDocument')?.run()
  }))

  return (
    <section
      aria-label="monaco editor"
      className={cn(
        'relative h-full overflow-hidden',
        !unstyled && [
          'border-input rounded-md border shadow-xs transition-[color,box-shadow]',
          'has-[.focused]:border-ring has-[.focused]:ring-ring/50 has-[.focused]:ring-3',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
          'dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40'
        ],
        className
      )}
      data-slot="monaco-editor"
      {...props}
    >
      <div
        ref={containerRef}
        className="size-full"
        onKeyDown={event => {
          if (event.key == 's' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault()
          }
        }}
      />
      {!isMounted && <div className="font-code absolute inset-0 flex items-center justify-center">Loading...</div>}
    </section>
  )
}

loader.config({
  paths: {
    vs: process.env.NEXT_PUBLIC_CDN_MONACO_EDITOR
  },
  'vs/nls': {
    availableLanguages: {
      '*': 'zh-cn'
    }
  }
})

const createHighlighterOnce = once(createHighlighter)
