'use client'

import { useObjectUrl } from '@repo/react-hooks'
import { useTheme } from '@repo/ui/hooks/use-theme'
import { cn } from '@repo/ui/lib/utils'
import React from 'react'

import htmlRaw from '../iframe/index.html?raw'

interface ChartPreviewProps {
  cdnUrl?: string
  className?: string
  content?: string
}

export function ChartPreview({ cdnUrl, className, content }: ChartPreviewProps) {
  const { isDark } = useTheme()

  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const blob = React.useMemo(() => {
    const html = htmlRaw
      .replace('{{theme}}', isDark ? 'dark' : 'light')
      .replace('{{runtime}}', cdnUrl ?? new URL('../../dist/index.iife.js', import.meta.url).href)
    return new Blob([html], { type: 'text/html' })
  }, [cdnUrl, isDark])

  const url = useObjectUrl(blob)

  const handleRender = () => {
    iframeRef.current?.contentWindow?.postMessage(content, '*')
  }

  React.useEffect(() => {
    handleRender()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  return (
    <iframe
      ref={iframeRef}
      className={cn('size-full bg-transparent', className)}
      loading="lazy"
      sandbox="allow-scripts"
      src={url}
      onLoad={handleRender}
    />
  )
}
