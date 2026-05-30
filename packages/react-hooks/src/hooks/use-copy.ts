import React from 'react'
import { useCopyToClipboard } from 'react-use'

import { useLatestRef } from './use-latest-ref'

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

  const onCopyRef = useLatestRef(onCopy)
  const onEndRef = useLatestRef(onEnd)

  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

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

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  return {
    copy: handleCopy,
    isCopied
  }
}
