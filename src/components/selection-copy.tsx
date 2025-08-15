'use client'

import React from 'react'
import { useCopyToClipboard, useEvent } from 'react-use'
import { toast } from 'sonner'

interface SelectionCopyProps {
  selector: string
}

export const SelectionCopy = ({ selector }: SelectionCopyProps) => {
  const [_, copy] = useCopyToClipboard()

  const selectedText = React.useRef('')

  React.useEffect(() => {
    const handler = () => {
      selectedText.current = window.getSelection()?.toString() || ''
    }
    document.addEventListener('selectionchange', handler)
    return () => {
      document.removeEventListener('selectionchange', handler)
    }
  }, [])

  useEvent('pointerdown', () => {
    selectedText.current = ''
  })

  React.useEffect(() => {
    const element = document.querySelector(selector)
    if (!element) return

    const handler = () => {
      if (!selectedText.current) return
      copy(selectedText.current)
      toast.success('已复制到剪贴板', {
        description: selectedText.current
      })
    }

    element.addEventListener('pointerup', handler)
    return () => {
      element.removeEventListener('pointerup', handler)
    }
  }, [copy, selector])

  return null
}
