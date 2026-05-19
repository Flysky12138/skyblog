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
  const [_, copy] = useCopyToClipboard()

  const [isCopied, setIsCopied] = React.useState(false)

  const timer = React.useRef<NodeJS.Timeout>(undefined)

  const handleCopy = React.useCallback(
    (text: string) => {
      if (isCopied) return

      copy(text)
      onCopy?.(text)

      setIsCopied(true)

      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setIsCopied(false)
        void onEnd?.()
      }, timeout)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [copy, isCopied, timeout]
  )

  return {
    copy: handleCopy,
    isCopied
  }
}
