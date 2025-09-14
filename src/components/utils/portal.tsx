import { isBrowser } from 'es-toolkit'
import React from 'react'
import ReactDOM from 'react-dom'

import { useMounted } from '@/hooks/use-mounted'

interface PortalProps extends React.PropsWithChildren {
  /**
   * 若未找到容器时是否自动创建一个元素并挂到 body
   * @default true
   */
  autoCreate?: boolean
  /**
   * 卸载时是否自动移除自动创建的容器
   * @default true
   */
  autoRemoveOnUnmount?: boolean
  /** 自动创建的元素类名 */
  className?: string
  /** 目标容器（优先级最高）*/
  container?: Element | null
  /**
   * 禁用，直接渲染到当前位置（便于降级/测试）
   * @default false
   */
  disabled?: boolean
  /**
   * 在容器开头插入（默认是 `append` 到末尾）
   * @default false
   */
  prepend?: boolean
  /** 通过选择器查找容器（次高）*/
  selector?: string
  /**
   * 自动创建时使用的标签名
   * @default 'div'
   */
  tagName?: React.HTMLElementType
  /** 容器就绪回调 */
  onMount?: (el: Element) => void
}

export const Portal = ({
  autoCreate = true,
  autoRemoveOnUnmount = true,
  children,
  className,
  container,
  disabled = false,
  prepend = false,
  selector,
  tagName = 'div',
  onMount
}: PortalProps) => {
  const mounted = useMounted()
  const createdRef = React.useRef<HTMLElement | null>(null)

  const targetEl = React.useMemo(() => {
    if (!isBrowser()) return null
    if (container) return container
    if (selector) {
      const found = document.querySelector(selector)
      if (found) return found
    }
    if (autoCreate) {
      const el = document.createElement(tagName)
      if (className) el.className = className
      if (prepend) {
        document.body.prepend(el)
      } else {
        document.body.append(el)
      }
      createdRef.current = el
      return el
    }
    return null
  }, [autoCreate, className, container, prepend, selector, tagName])

  React.useEffect(() => {
    if (!isBrowser()) return
    if (targetEl && onMount) onMount(targetEl)
    return () => {
      if (createdRef.current && autoRemoveOnUnmount) {
        createdRef.current.remove()
        createdRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetEl])

  if (!mounted) {
    return null
  }

  if (disabled) {
    return children
  }

  if (!targetEl) {
    return null
  }

  return ReactDOM.createPortal(children, targetEl)
}
