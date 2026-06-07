'use client'

import { ResizableBox, ResizableBoxSize } from '@repo/ui/components-self/resizable-box'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuTrigger
} from '@repo/ui/components/context-menu'
import { cn } from '@repo/ui/lib/utils'
import { NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { isEqual } from 'es-toolkit'
import React from 'react'

import { ImageAttributes } from '../../extensions/image'

export const ImageView = ReactNodeViewRenderer(ImageViewInner)

function ImageViewInner({ editor, node }: NodeViewProps) {
  const { alt, height, src, textAlign, title, width, widthFull } = node.attrs as ImageAttributes

  const [size, setSize] = React.useState<ResizableBoxSize>({ height: height ?? 0, width: width ?? 0 })
  const [naturalSize, setNaturalSize] = React.useState<null | ResizableBoxSize>(null)

  const isNaturalSize = Boolean(naturalSize && isEqual(naturalSize, size))

  // 同步 node attrs 的宽高变化（如 undo/redo）
  React.useEffect(() => {
    const nextSize = { height: height ?? 0, width: width ?? 0 }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSize(prev => (isEqual(prev, nextSize) ? prev : nextSize))
  }, [height, width])

  return (
    <NodeViewWrapper>
      <ContextMenu>
        <ResizableBox
          keepAspectRatio
          className={cn({
            'w-full!': widthFull
          })}
          data-image-align={textAlign}
          disabled={widthFull}
          size={size}
          style={{
            height: 'auto'
          }}
          onResize={setSize}
          onResizeEnd={(newSize, oldSize) => {
            if (isEqual(newSize, oldSize)) return
            editor
              .chain()
              .updateAttributes('image', { height: Math.round(newSize.height), width: Math.round(newSize.width) })
              .run()
          }}
        >
          <ContextMenuTrigger>
            <img
              data-drag-handle
              alt={alt ?? undefined}
              data-width-full={widthFull}
              decoding="async"
              height={size.height || undefined}
              loading="lazy"
              src={src ?? undefined}
              title={title ?? undefined}
              width={size.width || undefined}
              onLoad={event => {
                const img = event.currentTarget
                const newSize = { height: img.naturalHeight, width: img.naturalWidth }
                setNaturalSize(newSize)
                editor.chain().setMeta('addToHistory', false).updateAttributes('image', newSize).run()
              }}
            />
          </ContextMenuTrigger>
        </ResizableBox>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>尺寸</ContextMenuLabel>
            <ContextMenuCheckboxItem
              closeOnClick
              checked={widthFull}
              onCheckedChange={newValue => {
                editor.chain().updateAttributes('image', { widthFull: newValue }).run()
              }}
            >
              占满
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              closeOnClick
              checked={isNaturalSize}
              disabled={isNaturalSize}
              onClick={() => {
                if (!naturalSize) return
                editor.chain().updateAttributes('image', naturalSize).run()
              }}
            >
              原始{naturalSize && `（${naturalSize.width} x ${naturalSize.height}）`}
            </ContextMenuCheckboxItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </NodeViewWrapper>
  )
}
