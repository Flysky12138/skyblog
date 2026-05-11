'use client'

import loader, { Monaco } from '@monaco-editor/loader'
import { useTheme } from '@repo/ui/hooks/use-theme'
import { cn } from '@repo/ui/lib/utils'
import { shikiToMonaco } from '@shikijs/monaco'
import { editor } from 'monaco-editor'
import React from 'react'
import { BundledLanguage, BundledTheme } from 'shiki'

import { createHighlighterOnce, createMonacoEditorInitialOptions } from '../lib/editor'

export interface MonacoEditorProps extends ElementPropsWithoutEvents<HTMLDivElement> {
  className?: string
  /**
   * 是否为对比模式
   */
  isDiffMode?: boolean
  /**
   * 内容语言
   */
  language: BundledLanguage
  options?: Omit<editor.IStandaloneEditorConstructionOptions, 'language' | 'theme' | 'value'>
  originalValue?: string
  ref?: React.RefObject<MonacoEditorRef | null>
  /**
   * [暗色主题，亮色主题]
   *
   * @default ['dark-plus', 'light-plus']
   */
  themes?: [BundledTheme, BundledTheme]
  /**
   * 是否禁用默认样式
   */
  unstyled?: boolean
  value?: string
  onChange?: (value: string) => void
  /**
   * 初始化
   */
  onInit?: (monaco: Monaco, language: MonacoEditorProps['language']) => void
}

export interface MonacoEditorRef {
  editor?: editor.IStandaloneCodeEditor
  /**
   * 格式化
   */
  format: () => Promise<void> | undefined
}

export function MonacoEditor({
  className,
  isDiffMode,
  language,
  options = {},
  originalValue = '',
  ref,
  themes = ['dark-plus', 'light-plus'],
  unstyled,
  value = '',
  onChange,
  onInit,
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
  const handleDestroy = React.useEffectEvent(() => {
    editorRef.current?.dispose()
    diffEditorRef.current?.dispose()
  })
  // 创建编辑器
  const handleCreate = React.useEffectEvent((monaco?: Monaco) => {
    if (!containerRef.current) {
      console.warn('Monaco Editor root element not found')
      return
    }
    if (!monaco) return

    handleDestroy()

    if (isDiffMode) {
      diffEditorRef.current = monaco.editor.createDiffEditor(containerRef.current, _options)
      diffEditorRef.current.setModel({
        modified: monaco.editor.createModel(value, language),
        original: monaco.editor.createModel(originalValue, language)
      })
    } else {
      editorRef.current = monaco.editor.create(containerRef.current, _options)
      editorRef.current.setModel(monaco.editor.createModel(value, language))
    }

    editorRef.current?.onDidChangeModelContent(() => {
      const val = editorRef.current!.getValue()
      onChange?.(val)
    })
  })

  // 初始化
  React.useEffect(() => {
    void (async () => {
      const monaco = await loader.init()
      monacoRef.current = monaco

      onInit?.(monaco, language)

      const langs = [language]
      const highlighter = await createHighlighterOnce({ langs, themes })
      langs.forEach(id => monaco.languages.register({ id }))
      shikiToMonaco(highlighter, monaco)

      handleCreate(monaco)

      setIsMounted(true)
    })()

    return handleDestroy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 配置更新
  React.useEffect(() => {
    diffEditorRef.current?.updateOptions(_options)
    editorRef.current?.updateOptions(_options)
  }, [_options])

  // 切换编辑器
  React.useEffect(() => {
    handleCreate(monacoRef.current)
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
          'rounded-md border border-input shadow-xs transition-[color,box-shadow]',
          'has-[.focused]:border-ring has-[.focused]:ring-3 has-[.focused]:ring-ring/50',
          'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
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
      {!isMounted && (
        <div className="absolute inset-0 flex items-center justify-center" data-slot="monaco-loading">
          Loading...
        </div>
      )}
    </section>
  )
}
