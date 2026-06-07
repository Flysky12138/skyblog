'use client'

import { useRender } from '@base-ui/react'
import { useLatestRef } from '@repo/react-hooks'
import { mapValues } from 'es-toolkit'
import React from 'react'

import { Badge } from '../components/badge'
import { cn } from '../lib/utils'

export interface ResizableBoxProps extends useRender.ComponentProps<'div'> {
  /**
   * 自定义宽高比，默认使用 width/height
   */
  aspectRatio?: number
  /**
   * 非受控模式的初始尺寸
   */
  defaultSize?: ResizableBoxSize
  /**
   * 是否禁用拖拽
   */
  disabled?: boolean
  /**
   * 显示的拖拽手柄，默认只显示右下角
   *
   * @default ['e', 'w']
   */
  handles?: ResizeHandle[]
  /**
   * 是否保持宽高比
   *
   * @default false
   */
  keepAspectRatio?: boolean
  /**
   * 最大高度
   */
  maxHeight?: number
  /**
   * 最大宽度
   */
  maxWidth?: number
  /**
   * 最小高度
   *
   * @default 50
   */
  minHeight?: number
  /**
   * 最小宽度
   *
   * @default 50
   */
  minWidth?: number
  /**
   * 受控模式的尺寸
   */
  size?: ResizableBoxSize
  /**
   * 吸附步长
   */
  snap?: {
    x?: number
    y?: number
  }
  /**
   * 拖拽中的回调
   */
  onResize?: (size: ResizableBoxSize) => void
  /**
   * 拖拽结束的回调
   */
  onResizeEnd?: (newSize: ResizableBoxSize, oldSize: ResizableBoxSize) => void
}

export interface ResizableBoxSize {
  height: number
  width: number
}

export type ResizeHandle = 'e' | 'n' | 'ne' | 'nw' | 's' | 'se' | 'sw' | 'w'

const HANDLE_CURSOR: Record<ResizeHandle, string> = {
  e: 'cursor-ew-resize',
  n: 'cursor-ns-resize',
  ne: 'cursor-nesw-resize',
  nw: 'cursor-nwse-resize',
  s: 'cursor-ns-resize',
  se: 'cursor-nwse-resize',
  sw: 'cursor-nesw-resize',
  w: 'cursor-ew-resize'
}

const HANDLE_POSITION: Record<ResizeHandle, string> = {
  e: 'right-0 inset-y-0 w-1.5',
  n: 'inset-x-0 top-0 h-1.5',
  ne: 'top-0 right-0 size-3',
  nw: 'top-0 left-0 size-3',
  s: 'inset-x-0 bottom-0 h-1.5',
  se: 'bottom-0 right-0 size-3',
  sw: 'bottom-0 left-0 size-3',
  w: 'left-0 inset-y-0 w-1.5'
}

export function ResizableBox({
  aspectRatio,
  children,
  className,
  defaultSize,
  disabled = false,
  handles = ['e', 'w'],
  keepAspectRatio = false,
  maxHeight = Infinity,
  maxWidth = Infinity,
  minHeight = 50,
  minWidth = 50,
  render,
  size: controlledSize,
  snap,
  style,
  onResize,
  onResizeEnd,
  ...props
}: ResizableBoxProps) {
  const [internalSize, setInternalSize] = React.useState<ResizableBoxSize | undefined>(defaultSize)
  const isControlled = controlledSize !== undefined
  const size = isControlled ? controlledSize : internalSize

  const onResizeEndRef = useLatestRef(onResizeEnd)
  const sizeRef = useLatestRef(size)

  const [isResizing, setIsResizing] = React.useState(false)
  const activeHandleRef = React.useRef<null | ResizeHandle>(null)
  const startPosRef = React.useRef({ x: 0, y: 0 })
  const startSizeRef = React.useRef({ height: 0, width: 0 })
  const boxRef = React.useRef<HTMLDivElement>(null)

  const snapValue = (value: number, step?: number) => {
    if (step == null || step <= 0) return value
    return Math.round(value / step) * step
  }

  const constrainSize = (newWidth: number, newHeight: number, lockAspectRatio: boolean, originalAspectRatio: number) => {
    let width = newWidth
    let height = newHeight

    // 1. 保持宽高比（用变化量大的方向推导另一个）
    if (lockAspectRatio && originalAspectRatio > 0) {
      const widthDelta = Math.abs(newWidth - startSizeRef.current.width)
      const heightDelta = Math.abs(newHeight - startSizeRef.current.height)
      if (widthDelta >= heightDelta) {
        height = width / originalAspectRatio
      } else {
        width = height * originalAspectRatio
      }
    }

    // 2. 应用吸附
    width = snapValue(width, snap?.x)
    height = snapValue(height, snap?.y)

    // 3. 约束边界
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width))
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, height))

    // 4. 边界约束后再次修正宽高比
    if (lockAspectRatio && originalAspectRatio > 0) {
      const bothClamped = clampedWidth !== width && clampedHeight !== height

      if (bothClamped) {
        // 宽高都被夹住：选一个能尽量保持比例的方向
        const fromWidthH = Math.round(clampedWidth / originalAspectRatio)
        const fromHeightW = Math.round(clampedHeight * originalAspectRatio)

        const clampedFromWidthH = Math.max(minHeight, Math.min(maxHeight, fromWidthH))
        const clampedFromHeightW = Math.max(minWidth, Math.min(maxWidth, fromHeightW))

        const widthKept = fromWidthH >= minHeight && fromWidthH <= maxHeight
        const heightKept = fromHeightW >= minWidth && fromHeightW <= maxWidth

        if (widthKept) {
          // 从宽度推导高度完美落在范围内
          width = clampedWidth
          height = fromWidthH
        } else if (heightKept) {
          // 从高度推导宽度完美落在范围内
          height = clampedHeight
          width = fromHeightW
        } else {
          // 都不完美，选偏离更小的
          const widthDiff = Math.abs(fromWidthH - clampedFromWidthH)
          const heightDiff = Math.abs(fromHeightW - clampedFromHeightW)
          if (widthDiff <= heightDiff) {
            width = clampedWidth
            height = clampedFromWidthH
          } else {
            height = clampedHeight
            width = clampedFromHeightW
          }
        }
      } else if (clampedWidth !== width) {
        // 只有宽度被夹住，从宽度推导高度
        width = clampedWidth
        height = Math.round(clampedWidth / originalAspectRatio)
        height = Math.max(minHeight, Math.min(maxHeight, height))
      } else if (clampedHeight !== height) {
        // 只有高度被夹住，从高度推导宽度
        height = clampedHeight
        width = Math.round(clampedHeight * originalAspectRatio)
        width = Math.max(minWidth, Math.min(maxWidth, width))
      } else {
        width = clampedWidth
        height = clampedHeight
      }
    } else {
      width = clampedWidth
      height = clampedHeight
    }

    return { height, width }
  }

  const handleMouseDown = (event: React.MouseEvent, handle: ResizeHandle) => {
    if (disabled) return
    event.preventDefault()
    event.stopPropagation()

    let currentSize = sizeRef.current
    if (!currentSize || currentSize.width === 0 || currentSize.height === 0) {
      // 没有显式尺寸时，从 DOM 获取实际渲染尺寸
      const el = boxRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        currentSize = { height: rect.height, width: rect.width }
        if (!isControlled) {
          setInternalSize(currentSize)
        }
      } else {
        currentSize = { height: 200, width: 300 }
      }
    }

    activeHandleRef.current = handle
    startPosRef.current = { x: event.clientX, y: event.clientY }
    startSizeRef.current = { height: currentSize.height, width: currentSize.width }
    setIsResizing(true)

    /**
     * 获取 Chrome DevTools 风格的修饰键步进倍数：
     * - 无修饰键: ×1（步进 1）
     * - Shift: ×10（步进 10）
     * - Alt: ×0.1（步进 0.1，微调）
     * - Ctrl/Meta: ×100（大步进）
     */
    const getModifierMultiplier = (event: MouseEvent) => {
      let multiplier = 1
      if (event.shiftKey) multiplier *= 10
      if (event.altKey) multiplier *= 0.1
      if (event.ctrlKey || event.metaKey) multiplier *= 100
      return multiplier
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rawDx = moveEvent.clientX - startPosRef.current.x
      const rawDy = moveEvent.clientY - startPosRef.current.y
      const mod = getModifierMultiplier(moveEvent)

      // 对每个像素的位移应用修饰键倍数，实现类似 Chrome DevTools 的步进效果
      const dx = rawDx * mod
      const dy = rawDy * mod

      let newWidth = startSizeRef.current.width
      let newHeight = startSizeRef.current.height

      const curHandle = activeHandleRef.current!
      // 计算宽度的变化
      if (curHandle.includes('e')) {
        newWidth = startSizeRef.current.width + dx
      } else if (curHandle.includes('w')) {
        newWidth = startSizeRef.current.width - dx
      }

      // 计算高度的变化
      if (curHandle.includes('s')) {
        newHeight = startSizeRef.current.height + dy
      } else if (curHandle.includes('n')) {
        newHeight = startSizeRef.current.height - dy
      }

      const lockAspectRatio = keepAspectRatio || aspectRatio != null
      const ratio = aspectRatio ?? startSizeRef.current.width / startSizeRef.current.height

      const constrained = constrainSize(newWidth, newHeight, lockAspectRatio, ratio)

      if (!isControlled) {
        setInternalSize(constrained)
      }
      onResize?.(constrained)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      activeHandleRef.current = null
      onResizeEndRef.current?.(sizeRef.current!, startSizeRef.current)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // 清理事件（安全兜底）
  React.useEffect(() => {
    if (!isResizing) return

    const handleMouseUp = () => {
      setIsResizing(false)
      activeHandleRef.current = null
      onResizeEndRef.current?.(sizeRef.current!, startSizeRef.current)
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResizing])

  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      ref: boxRef,
      children: (
        <>
          {children}
          {!disabled && (
            <>
              {size && isResizing && (
                <Badge className="absolute inset-e-0 top-0 rounded-none text-sm" variant="secondary">
                  {Math.round(size.width)} x {Math.round(size.height)}
                </Badge>
              )}
              {handles.map(handle => (
                <div
                  key={handle}
                  className={cn(
                    'absolute z-1 flex items-center justify-center',
                    'opacity-0 transition-opacity group-hover:opacity-100',
                    HANDLE_POSITION[handle],
                    HANDLE_CURSOR[handle],
                    'before:absolute before:inset-0 before:z-10',
                    'hover:after:bg-foreground/40 active:after:bg-foreground/60',
                    {
                      'after:block after:h-0.5 after:w-8 after:rounded-full after:bg-border': handle === 'n' || handle === 's',
                      'after:block after:h-8 after:w-0.5 after:rounded-full after:bg-border': handle === 'e' || handle === 'w',
                      'after:block after:size-2 after:rounded-sm after:bg-border after:ring-1 after:ring-background':
                        handle === 'se' || handle === 'sw' || handle === 'ne' || handle === 'nw'
                    }
                  )}
                  data-handle={handle}
                  data-resizing={isResizing ? '' : undefined}
                  onMouseDown={event => {
                    handleMouseDown(event, handle)
                  }}
                />
              ))}
            </>
          )}
        </>
      ),
      className: cn(
        'group relative max-w-full overflow-hidden',
        {
          'pointer-events-none select-none': isResizing
        },
        className
      ),
      style: {
        ...(size ? mapValues(size, v => v || 'auto') : {}),
        ...style
      },
      ...props
    },
    state: {
      slot: 'resizable-box'
    }
  })
}
