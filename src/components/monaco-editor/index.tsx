'use client'

import useTheme from '@/hooks/useTheme'
import { cn } from '@/lib/cn'
import { DiffEditor, DiffEditorProps, Editor, EditorProps, loader, OnChange, OnMount } from '@monaco-editor/react'
import { AutoAwesome, Code, CodeOff, ZoomInMap, ZoomOutMap } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import { editor } from 'monaco-editor'
import React from 'react'
import { useToggle } from 'react-use'
import Card from '../layout/Card'
import './index.css'

loader.config({
  paths: {
    vs: '/cdn/cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs'
  },
  'vs/nls': {
    availableLanguages: {
      '*': 'zh-cn'
    }
  }
})

const OPTIONS: editor.IStandaloneEditorConstructionOptions = {
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
  className?: string
  code: EditorProps['value']
  height: number | string
  oldCode: DiffEditorProps['original']
  onChange: OnChange
  options?: editor.IStandaloneEditorConstructionOptions
  toolbarRender?: (params: { diffMode: boolean; mounted: boolean; zoomIn: boolean }) => React.ReactNode
}

const MonacoEditor: React.ForwardRefRenderFunction<MonacoEditorRef, MonacoEditorProps> = (
  { toolbarRender, className, code = '', height, oldCode = '', options = {}, onChange, ...props },
  ref
) => {
  // 设置编辑器全屏高度
  const cardToolbarRef = React.useRef<HTMLDivElement>(null)
  const [zoomIn, zoomInToggle] = useToggle(false)
  if (zoomIn) height = `calc(100dvh - ${cardToolbarRef.current?.offsetHeight ?? 50}px)`

  // 隐藏滚动条
  React.useEffect(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.offsetWidth
    document.documentElement.style.overflow = zoomIn ? 'hidden' : ''
    document.body.style.paddingRight = zoomIn ? `${scrollBarWidth}px` : ''
    document.querySelectorAll<HTMLElement>('.mui-fixed').forEach(el => {
      el.style.paddingRight = zoomIn ? `${scrollBarWidth}px` : ''
      el.ariaHidden = zoomIn ? 'true' : null
    })
  }, [zoomIn])

  // 对比模式
  const [diffMode, diffModeToggle] = useToggle(false)

  // 主题
  const { isDark } = useTheme()
  const theme = isDark ? 'vs-dark' : 'vs'

  // 组件整体高度；用于放大时填充高度，避免布局抖动
  const cardHeight = React.useRef(0)

  // 加载完成
  const [mounted, setMounted] = React.useState(false)

  const cardRef = React.useRef<HTMLDivElement>()
  const editorRef = React.useRef<MonacoEditorRef['editor']>()
  React.useImperativeHandle(ref, () => ({
    editor: editorRef.current
  }))

  return (
    <>
      <Card
        ref={cardRef}
        className={cn(
          'z-50 overflow-hidden rounded-md',
          {
            'fixed inset-0 z-header rounded-none border-0 backdrop-blur-3xl': zoomIn
          },
          className
        )}
        onKeyDown={event => {
          if (event.key == 's' && (event.ctrlKey || event.metaKey)) event.preventDefault()
        }}
      >
        <div ref={cardToolbarRef} className="s-bg-title s-border-color-card flex h-header items-center gap-3 overflow-auto border-b px-3.5">
          <p className="s-subtitle select-none font-title text-xl">{props.language}</p>
          <span aria-hidden="true" className="grow"></span>
          {toolbarRender?.({ diffMode, mounted, zoomIn })}
          {mounted && (
            <>
              {diffMode || (
                <Tooltip title="格式调整">
                  <IconButton variant="outlined" onClick={() => editorRef.current?.getAction('editor.action.formatDocument')?.run()}>
                    <AutoAwesome />
                  </IconButton>
                </Tooltip>
              )}
              {code != oldCode && (
                <Tooltip title="差异对比">
                  <IconButton variant="outlined" onClick={diffModeToggle}>
                    {diffMode ? <CodeOff /> : <Code />}
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
          <IconButton
            aria-label={zoomIn ? '还原尺寸' : '全屏'}
            variant="outlined"
            onClick={() => {
              if (!zoomIn) {
                cardHeight.current = cardRef.current?.offsetHeight || 0
              }
              zoomInToggle()
            }}
          >
            {zoomIn ? <ZoomInMap /> : <ZoomOutMap />}
          </IconButton>
        </div>
        {diffMode ? (
          <DiffEditor height={height} modified={code} options={Object.assign({}, OPTIONS, options)} original={oldCode} theme={theme} {...props} />
        ) : (
          <Editor
            height={height}
            options={Object.assign({}, OPTIONS, { lineDecorationsWidth: 0 }, options)}
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
      {zoomIn && <span aria-hidden="true" className="block" style={{ height: `${cardHeight.current}px` }}></span>}
    </>
  )
}

export default React.forwardRef(MonacoEditor)
