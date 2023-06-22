'use client'

import './index.css'

import loader, { Monaco } from '@monaco-editor/loader'
import { Root, SlotProps } from '@radix-ui/react-slot'
import { shikiToMonaco } from '@shikijs/monaco'
import { toMerged } from 'es-toolkit'
import { editor, IDisposable } from 'monaco-editor'
import React from 'react'
import { createHighlighter } from 'shiki'

import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

import { langs, monacoEditorDefaultOptions, themes } from './options'

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

interface MonacoEditorProps extends LanguageConfig, Omit<SlotProps, 'children' | 'onChange'> {
  asChild?: boolean
  /** 是否为对比模式 */
  isDiffMode?: boolean
  options?: Omit<editor.IStandaloneEditorConstructionOptions, 'language' | 'theme' | 'value'>
  originalValue?: string
  ref?: React.RefObject<MonacoEditorRef | null>
  value?: string
  onChange?: (value: string) => void
}

export function MonacoEditor({
  asChild,
  className,
  isDiffMode,
  language,
  options = {},
  originalValue = '',
  ref,
  registerEvents,
  value = '',
  onChange,
  ...props
}: MonacoEditorProps) {
  const Comp = asChild ? Root : 'div'

  const rootRef = React.useRef<HTMLDivElement>(null)
  const monacoRef = React.useRef<any>(null)
  const editorRef = React.useRef<editor.IStandaloneCodeEditor>(undefined)
  const diffEditorRef = React.useRef<editor.IStandaloneDiffEditor>(undefined)

  const [isMounted, setIsMounted] = React.useState(false)

  // 主题
  const { isDark } = useTheme()
  const theme = themes[isDark ? 0 : 1]

  // 配置
  const _options = React.useMemo(() => toMerged(monacoEditorDefaultOptions, { ...options, language, theme }), [language, options, theme])

  // 销毁编辑器
  const destroyMonacoEditor = React.useEffectEvent(() => {
    editorRef.current?.dispose()
    diffEditorRef.current?.dispose()
  })
  // 创建编辑器
  const createMonacoEditor = React.useEffectEvent((monaco?: any) => {
    if (!monaco) return

    destroyMonacoEditor()

    if (isDiffMode) {
      diffEditorRef.current = monaco.editor.createDiffEditor(rootRef.current, _options)
      diffEditorRef.current!.setModel({
        modified: monaco.editor.createModel(value, language),
        original: monaco.editor.createModel(originalValue, language)
      })
    } else {
      editorRef.current = monaco.editor.create(rootRef.current, _options)
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

      const highlighter = await createHighlighter({ langs, themes })
      langs.forEach(id => monaco.languages.register({ id }))
      shikiToMonaco(highlighter, monaco)

      setIsMounted(true)

      createMonacoEditor(monaco)
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
    if (!editorRef.current) return
    if (isDiffMode) return
    // 外部 value 更新（防止死循环）
    if (value != editorRef.current.getValue()) {
      editorRef.current.setValue(value)
    }
  }, [isDiffMode, value])

  // 抛出属性
  React.useImperativeHandle(ref, () => ({
    editor: editorRef.current,
    format: () => editorRef.current?.getAction('editor.action.formatDocument')?.run()
  }))

  return (
    <Comp
      ref={rootRef}
      aria-label="monaco editor"
      className={cn('h-full overflow-hidden', className)}
      onKeyDown={event => {
        if (event.key == 's' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault()
        }
      }}
      {...props}
    >
      {!isMounted && <div className="font-code flex size-full items-center justify-center">Loading...</div>}
    </Comp>
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
