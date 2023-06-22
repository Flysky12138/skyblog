import { isBrowser } from 'es-toolkit'
import React from 'react'
import ReactDOM from 'react-dom'

import { useMounted } from '@/hooks/use-mounted'

interface PortalProps extends React.PropsWithChildren {
  /** 目标容器（优先级最高）*/
  container?: Element | null
  /**
   * 禁用，直接渲染到当前位置（便于降级/测试）
   * @default false
   */
  disabled?: boolean
  /** 通过选择器查找容器（次高）*/
  selector?: string
  /** 容器就绪回调 */
  onMount?: (el: Element) => void
}

export const Portal = ({ children, container, disabled = false, selector, onMount }: PortalProps) => {
  const isMounted = useMounted()

  const targetEl = React.useMemo(() => {
    if (!isBrowser()) return null
    if (container) return container
    if (selector) {
      const found = document.querySelector(selector)
      if (found) return found
    }
    return null
  }, [container, selector])

  React.useEffect(() => {
    if (!isBrowser()) return
    if (targetEl && onMount) {
      onMount(targetEl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetEl])

  if (!isMounted || !targetEl) {
    return null
  }

  if (disabled) {
    return children
  }

  return ReactDOM.createPortal(children, targetEl)
}
