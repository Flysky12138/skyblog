import React from 'react'

import { useLatestRef } from './use-latest-ref'

interface UseRoutingControlOptions {
  /**
   * 是否启用路由控制
   *
   * @default true
   */
  enabled?: boolean
  /**
   * popstate 时调用的关闭回调
   *
   * @example
   * ```tsx
   * onClose={() => dialogRef.current?.close()}
   * // 或
   * onClose={() => setOpen(false)}
   * ```
   */
  onClose?: () => void
}

/**
 * 通用弹窗/抽屉路由控制 hook
 *
 * 通过 `history.pushState` 记录打开状态，用户点击浏览器返回键时触发 `popstate` 事件来关闭弹窗/抽屉，而不是直接路由跳转
 *
 * @example
 * ```tsx
 * // Dialog
 * const { onOpenChange } = useRoutingControl({
 *   onClose: () => dialogRef.current?.close(),
 * })
 * <Dialog ref={dialogRef} onOpenChange={onOpenChange} />
 *
 * // Drawer — 用 state 控制
 * const [open, setOpen] = React.useState(false)
 * const { onOpenChange } = useRoutingControl({
 *   onClose: () => setOpen(false),
 * })
 * <Drawer open={open} onOpenChange={onOpenChange} />
 * ```
 */
export function useRoutingControl({ enabled = true, onClose }: UseRoutingControlOptions = {}) {
  const isClosingFromPopstate = React.useRef(false)

  const onCloseRef = useLatestRef(onClose)

  React.useEffect(() => {
    if (!enabled) return

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault()
      isClosingFromPopstate.current = true
      onCloseRef.current?.()
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)

      // 组件卸载时清除残留的历史记录
      const state = window.history.state as null | Record<string, unknown>
      if (state?.isOverlayOpen) {
        window.history.replaceState({ ...state, isOverlayOpen: false }, '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!enabled) return

      const state = window.history.state as null | Record<string, unknown>

      if (open) {
        if (state?.isOverlayOpen === false) {
          window.history.replaceState({ ...state, isOverlayOpen: true }, '')
        } else {
          window.history.pushState({ ...state, isOverlayOpen: true }, '')
        }
      } else {
        if (isClosingFromPopstate.current) {
          isClosingFromPopstate.current = false
        } else {
          window.history.back()
        }
      }
    },
    [enabled]
  )

  return {
    onOpenChange: handleOpenChange
  }
}
