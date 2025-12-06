'use client'

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

export function Portal({ children, container, disabled = false, selector, onMount }: PortalProps) {
  const isMounted = useMounted()

  const [targetEl, setTargetEl] = React.useState<Element | null>(null)
  const createdRef = React.useRef<Element>(null)

  React.useEffect(() => {
    // 如果被禁用，确保不创建或保留容器
    if (disabled) {
      if (createdRef.current) {
        createdRef.current.remove()
        createdRef.current = null
      }
      setTargetEl(null)
      return
    }

    // 优先使用显式提供的 container
    if (container) {
      setTargetEl(container)
      return
    }

    // 尝试使用 selector 查找容器
    if (selector) {
      const found = document.querySelector(selector)
      if (found) {
        setTargetEl(found)
        return
      }
    }

    // 回退：创建一个元素并挂载到 body，卸载时清理该元素
    const el = document.createElement('div')
    document.body.append(el)
    createdRef.current = el
    setTargetEl(el)

    return () => {
      if (createdRef.current) {
        createdRef.current.remove()
        createdRef.current = null
      }
    }
  }, [container, selector, disabled])

  React.useEffect(() => {
    if (targetEl && onMount) {
      onMount(targetEl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetEl])

  if (!isMounted || !targetEl) return null
  if (disabled) return children

  return ReactDOM.createPortal(children, targetEl)
}
