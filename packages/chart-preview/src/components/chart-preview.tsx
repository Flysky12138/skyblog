'use client'

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

  const url = React.useMemo(() => {
    const html = htmlRaw
      .replace('{{theme}}', isDark ? 'dark' : 'light')
      .replace('{{runtime}}', cdnUrl ?? new URL('../../dist/index.iife.js', import.meta.url).href)
    const blob = new Blob([html], { type: 'text/html' })
    return URL.createObjectURL(blob)
  }, [cdnUrl, isDark])

  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [url])

  const handleRender = React.useEffectEvent(() => {
    iframeRef.current?.contentWindow?.postMessage(content, '*')
  })

  React.useEffect(() => {
    handleRender()
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
