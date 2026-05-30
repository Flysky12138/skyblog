/* eslint-disable react-hooks/refs */
import React from 'react'
import { useCopyToClipboard } from 'react-use'

interface UseCopyProps {
  /**
   * 状态回退延迟时间，单位毫秒
   *
   * @default 1000
   */
  timeout?: number
  onCopy?: (text: string) => void
  onEnd?: () => Promise<void>
}

export const useCopy = ({ timeout = 1000, onCopy, onEnd }: UseCopyProps = {}) => {
  const [, copy] = useCopyToClipboard()

  const [isCopied, setIsCopied] = React.useState(false)

  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const onCopyRef = React.useRef(onCopy)
  onCopyRef.current = onCopy

  const onEndRef = React.useRef(onEnd)
  onEndRef.current = onEnd

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  const handleCopy = React.useCallback(
    (text: string) => {
      if (isCopied) return

      copy(text)
      onCopyRef.current?.(text)

      setIsCopied(true)

      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setIsCopied(false)
        void onEndRef.current?.()
      }, timeout)
    },
    [copy, isCopied, timeout]
  )

  return {
    copy: handleCopy,
    isCopied
  }
}
