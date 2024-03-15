'use client'

import useTheme from '@/hooks/useTheme'
import { cn } from '@/lib/cn'
import { DiffEditor, DiffEditorProps, Editor, EditorProps, loader, OnChange, OnMount } from '@monaco-editor/react'
import { AutoAwesome, SettingsEthernet, ZoomInMap, ZoomOutMap } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import { editor } from 'monaco-editor'
import React from 'react'
import { useToggle } from 'react-use'
import Card from '../layout/Card'

import './index.scss'

loader.config({
  paths: {
    vs: '/cdn/cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  },
  'vs/nls': {
    availableLanguages: {
      '*': 'zh-cn'
    }
  }
})

const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  contextmenu: false,
  fontFamily: 'inherit',
  fontSize: 14,
  lineDecorationsWidth: 15,
  lineNumbersMinChars: 4,
  minimap: { enabled: true },
  renderLineHighlight: 'all',
  roundedSelection: true,
  scrollBeyondLastLine: false,
  suggest: {}
}

export type LanguagePropsType = Required<Pick<EditorProps, 'language' | 'beforeMount'>>

export interface MonacoEditorRef {
  editor?: Parameters<OnMount>[0]
}
interface MonacoEditorProps extends LanguagePropsType, Pick<EditorProps, 'loading'> {
  children?: React.ReactNode
  className?: string
  code: EditorProps['value']
  height: number | string
  oldCode: DiffEditorProps['original']
  onChange: OnChange
  options?: editor.IStandaloneEditorConstructionOptions
}

export default React.forwardRef<MonacoEditorRef, MonacoEditorProps>(function MonacoEditor(
  { children, className, code, height, oldCode, options = {}, onChange, ...props },
  ref
) {
  const containerRef = React.useRef<HTMLDivElement>()
  const editorRef = React.useRef<MonacoEditorRef['editor']>()

  React.useImperativeHandle(ref, () => ({
    editor: editorRef.current
  }))

  // 设置编辑器全屏高度
  const cardRef = React.useRef<HTMLElement>()
  const [zoom, zoomToggle] = useToggle(false)
  if (zoom) height = `calc(100dvh - ${cardRef.current?.offsetHeight ?? 50}px)`

  // 隐藏滚动条
  React.useEffect(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.offsetWidth
    document.documentElement.style.overflow = zoom ? 'hidden' : ''
    document.body.style.paddingRight = zoom ? `${scrollBarWidth}px` : ''
    document.querySelectorAll<HTMLElement>('.mui-fixed').forEach(el => {
      el.style.paddingRight = zoom ? `${scrollBarWidth}px` : ''
      el.ariaHidden = zoom ? 'true' : null
    })
  }, [zoom])

  // 模式
  const [diffMode, diffModeToggle] = useToggle(false)

  // 主题
  const { isDark } = useTheme()
  const theme = isDark ? 'vs-dark' : 'vs'

  // 容器高度；用于放大时填充高度，避免布局抖动
  const containerHeight = React.useRef(0)

  // 加载完成
  const [mounted, setMounted] = React.useState(false)

  return (
    <>
      <Card
        ref={containerRef}
        className={cn(
          'z-50 overflow-hidden rounded-md',
          {
            'fixed inset-0 z-header rounded-none border-0 backdrop-blur-3xl': zoom
          },
          className
        )}
        onKeyDown={event => {
          if (event.key == 's' && (event.ctrlKey || event.metaKey)) event.preventDefault()
        }}
      >
        <Card
          ref={cardRef}
          className={cn('flex h-header items-center gap-3 overflow-auto rounded-md rounded-b-none border-x-0 border-t-0 px-3.5', {
            'rounded-none': zoom
          })}
        >
          <p className="s-subtitle select-none font-title text-xl">{props.language}</p>
          <span aria-hidden="true" className="grow"></span>
          {children}
          {mounted && (
            <>
              {diffMode || (
                <Tooltip title="格式调整">
                  <IconButton variant="outlined" onClick={() => editorRef.current?.getAction('editor.action.formatDocument')?.run()}>
                    <AutoAwesome />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="差异对比">
                <IconButton variant="outlined" onClick={diffModeToggle}>
                  <SettingsEthernet />
                </IconButton>
              </Tooltip>
            </>
          )}
          <IconButton
            aria-label={zoom ? '还原尺寸' : '全屏'}
            variant="outlined"
            onClick={() => {
              if (!zoom) {
                containerHeight.current = containerRef.current?.offsetHeight || 0
              }
              zoomToggle()
            }}
          >
            {zoom ? <ZoomInMap /> : <ZoomOutMap />}
          </IconButton>
        </Card>
        {diffMode ? (
          <DiffEditor height={height} modified={code} options={Object.assign({}, defaultOptions, options)} original={oldCode} theme={theme} {...props} />
        ) : (
          <Editor
            height={height}
            options={Object.assign({}, defaultOptions, { lineDecorationsWidth: 0 }, options)}
            theme={theme}
            value={code}
            onChange={onChange}
            onMount={editor => {
              editorRef.current = editor
              setMounted(true)
            }}
            {...props}
          />
        )}
      </Card>
      {zoom && <span aria-hidden="true" className="block" style={{ height: `${containerHeight.current}px` }}></span>}
    </>
  )
})
