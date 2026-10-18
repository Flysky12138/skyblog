'use client'

import loader, { Monaco } from '@monaco-editor/loader'
import { useTheme } from '@repo/ui/hooks/use-theme'
import { cn } from '@repo/ui/lib/utils'
import { shikiToMonaco } from '@shikijs/monaco'
import { editor, IDisposable } from 'monaco-editor'
import React from 'react'
import { BundledLanguage, BundledTheme, createHighlighter } from 'shiki'

import { createMonacoEditorInitialOptions } from '../lib/editor'

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
  isDiffMode = false,
  language,
  options,
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

  // Monaco 实例
  const monacoRef = React.useRef<Monaco>(undefined)

  // 文本模型
  const modelRef = React.useRef<editor.ITextModel>(undefined)
  const originalModelRef = React.useRef<editor.ITextModel>(undefined)

  // 编辑器实例
  const editorRef = React.useRef<editor.IStandaloneCodeEditor>(undefined)
  const diffEditorRef = React.useRef<editor.IStandaloneDiffEditor>(undefined)

  // 资源
  const changeListenerRef = React.useRef<IDisposable>(undefined)
  const initializedRef = React.useRef(false)

  // 防止外部更新 value 时触发 onChange
  const syncingRef = React.useRef(false)

  const [isMounted, setIsMounted] = React.useState(false)

  const { isDark } = useTheme()
  const theme = themes[isDark ? 0 : 1]

  const _options = React.useMemo(() => createMonacoEditorInitialOptions({ ...options, language, theme }), [options, language, theme])

  // 获取当前实际编辑器
  const getActiveEditor = React.useEffectEvent(() => {
    return isDiffMode ? diffEditorRef.current?.getModifiedEditor() : editorRef.current
  })

  // 销毁编辑器和模型
  const handleDestroy = React.useEffectEvent(() => {
    changeListenerRef.current?.dispose()
    changeListenerRef.current = undefined

    editorRef.current?.dispose()
    diffEditorRef.current?.dispose()

    editorRef.current = undefined
    diffEditorRef.current = undefined

    modelRef.current?.dispose()
    originalModelRef.current?.dispose()

    modelRef.current = undefined
    originalModelRef.current = undefined
  })

  // 创建编辑器
  const handleCreate = React.useEffectEvent((monaco?: Monaco) => {
    const container = containerRef.current

    if (!container || !monaco) return

    handleDestroy()

    const modifiedModel = monaco.editor.createModel(value, language)
    modelRef.current = modifiedModel

    if (isDiffMode) {
      const originalModel = monaco.editor.createModel(originalValue, language)

      originalModelRef.current = originalModel

      const diffEditor = monaco.editor.createDiffEditor(container, _options)

      diffEditorRef.current = diffEditor

      diffEditor.setModel({
        modified: modifiedModel,
        original: originalModel
      })
    } else {
      editorRef.current = monaco.editor.create(container, {
        ..._options,
        model: modifiedModel
      })
    }

    const activeEditor = isDiffMode ? diffEditorRef.current?.getModifiedEditor() : editorRef.current

    changeListenerRef.current = activeEditor?.onDidChangeModelContent(() => {
      if (syncingRef.current) return

      onChange?.(activeEditor.getValue())
    })
  })

  // 初始化 Monaco 和 Shiki
  React.useEffect(() => {
    let ignore = false

    const init = async () => {
      let highlighter: Awaited<ReturnType<typeof createHighlighter>> | undefined

      try {
        const monaco = await loader.init()

        if (ignore) return

        monacoRef.current = monaco

        onInit?.(monaco, language)

        highlighter = await createHighlighter({
          langs: [language],
          themes
        })

        if (ignore) {
          highlighter.dispose()
          return
        }

        monaco.languages.register({ id: language })
        shikiToMonaco(highlighter, monaco)

        handleCreate(monaco)

        initializedRef.current = true
        setIsMounted(true)
      } catch (error) {
        if (!ignore) {
          console.error('Failed to initialize Monaco Editor:', error)
        }

        highlighter?.dispose()
      }
    }

    void init()

    return () => {
      ignore = true
      initializedRef.current = false
      handleDestroy()
    }
    // 初始化只执行一次，使用最新的 props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 更新编辑器配置
  React.useEffect(() => {
    editorRef.current?.updateOptions(_options)
    diffEditorRef.current?.updateOptions(_options)
  }, [_options])

  // 切换普通模式和 Diff 模式
  React.useEffect(() => {
    if (!initializedRef.current) return

    handleCreate(monacoRef.current)
  }, [isDiffMode])

  // 同步外部内容
  React.useEffect(() => {
    const monaco = monacoRef.current
    if (!monaco || !initializedRef.current) return

    syncingRef.current = true

    try {
      // 更新修改侧内容
      const modifiedModel = modelRef.current

      if (modifiedModel && modifiedModel.getValue() !== value) {
        modifiedModel.setValue(value)
      }

      // 更新对比侧原始内容
      const originalModel = originalModelRef.current

      if (originalModel && originalModel.getValue() !== originalValue) {
        originalModel.setValue(originalValue)
      }

      // 同步语言
      if (modifiedModel && modifiedModel.getLanguageId() !== language) {
        monaco.editor.setModelLanguage(modifiedModel, language)
      }

      if (originalModel && originalModel.getLanguageId() !== language) {
        monaco.editor.setModelLanguage(originalModel, language)
      }
    } finally {
      syncingRef.current = false
    }
  }, [value, originalValue, language, isDiffMode])

  // 同步主题
  React.useEffect(() => {
    const monaco = monacoRef.current
    if (!monaco) return

    monaco.editor.setTheme(theme)
  }, [theme])

  // 暴露实例和方法
  React.useImperativeHandle(
    ref,
    () => ({
      get editor() {
        return getActiveEditor()
      },

      format: () => getActiveEditor()?.getAction('editor.action.formatDocument')?.run()
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDiffMode]
  )

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
          if (event.key.toLowerCase() === 's' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault()
          }
        }}
      />

      {!isMounted && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/60" data-slot="monaco-loading">
          Loading...
        </div>
      )}
    </section>
  )
}
