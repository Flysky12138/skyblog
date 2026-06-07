'use client'

import { useLatestRef } from '@repo/react-hooks'
import { ResizableBox, ResizableBoxSize } from '@repo/ui/components-self/resizable-box'
import { NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { isEqual } from 'es-toolkit'
import React from 'react'

import { ExcalidrawAttributes } from '../../extensions/excalidraw'
import { getExcalidrawEditHandler } from '../../lib/dialog-bridge/excalidraw-dialog-bridge'
import { applySizeToSvg, parseSvgSize, renderExcalidrawElements } from '../../lib/render/excalidraw-render'

export const ExcalidrawView = ReactNodeViewRenderer(ExcalidrawViewInner, {
  attrs: {
    'data-type': 'excalidraw'
  }
})

function ExcalidrawViewInner({ editor, getPos, node }: NodeViewProps) {
  const { elements, height, textAlign, width } = node.attrs as ExcalidrawAttributes

  const prevElementsRef = React.useRef(elements)
  const hasElements = Array.isArray(elements) && elements.length > 0

  const initialSize: ResizableBoxSize = React.useMemo(() => ({ height: height ?? 0, width: width ?? 0 }), [height, width])
  const sizeInitialized = React.useRef(!!(width ?? height))

  const [svg, setSvg] = React.useState<null | string>(null)
  const [size, setSize] = React.useState<ResizableBoxSize>(initialSize)
  const sizeRef = useLatestRef(size)

  // 更新 SVG 中的 width/height 属性
  const updateSvgSize = (newSize: ResizableBoxSize) => {
    setSize(prev => (isEqual(prev, newSize) ? prev : newSize))
    setSvg(prev => (prev ? applySizeToSvg(prev, newSize) : prev))
  }

  // 鼠标点击时触发编辑。onClick 会在没聚焦时不会触发
  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button !== 0) return
    const pos = getPos()
    if (typeof pos !== 'number') return
    editor.chain().focus().setNodeSelection(pos).run()

    const startX = event.clientX
    const startY = event.clientY

    const onMouseUp = (event: MouseEvent) => {
      document.removeEventListener('mouseup', onMouseUp)
      const dx = Math.abs(event.clientX - startX)
      const dy = Math.abs(event.clientY - startY)
      if (dx > 4 || dy > 4) return // 拖拽不触发编辑
      getExcalidrawEditHandler()?.({ elements, pos })
    }

    document.addEventListener('mouseup', onMouseUp)
  }

  // 当 node attrs 的宽高变化时（如 undo/redo），同步本地 size 状态
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateSvgSize(initialSize)
  }, [initialSize])

  React.useEffect(() => {
    if (!hasElements) return

    // 内容编辑（elements 变化）时重新解析默认宽高
    if (prevElementsRef.current !== elements) {
      prevElementsRef.current = elements
      sizeInitialized.current = false
    }

    let ignore = false

    void (async () => {
      const result = await renderExcalidrawElements(elements)
      if (!ignore && result) {
        if (!sizeInitialized.current) {
          sizeInitialized.current = true
          const parsed = parseSvgSize(result)
          if (parsed) setSize(parsed)
          setSvg(result)
        } else {
          setSvg(applySizeToSvg(result, sizeRef.current))
        }
      }
    })()

    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, hasElements])

  if (!hasElements) return null

  return (
    <NodeViewWrapper data-excalidraw-align={textAlign}>
      <ResizableBox
        keepAspectRatio
        className="rounded ring-border hover:bg-secondary hover:ring"
        size={size}
        onResize={updateSvgSize}
        onResizeEnd={newSize => {
          const pos = getPos()
          if (typeof pos !== 'number') return
          editor
            .chain()
            .setNodeSelection(pos)
            .updateAttributes('excalidraw', { height: Math.round(newSize.height), width: Math.round(newSize.width) })
            .run()
        }}
      >
        {svg ? (
          <div dangerouslySetInnerHTML={{ __html: svg }} data-drag-handle role="button" onMouseDown={handleMouseDown} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">加载中...</div>
        )}
      </ResizableBox>
    </NodeViewWrapper>
  )
}
