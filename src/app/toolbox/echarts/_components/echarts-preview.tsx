'use client'

import { groupBy } from 'es-toolkit'
import React from 'react'

import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'
import manifest from '~/public/embed/.vite/manifest.json?raw'

import htmlRaw from './index.html?raw'

interface EchartsPreviewProps {
  className?: string
  options?: string
}

export function EchartsPreview({ className, options }: EchartsPreviewProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const { isDark } = useTheme()
  const [url, setUrl] = React.useState<string>()

  React.useEffect(() => {
    const { file } = groupBy(Object.values<{ file: string; name: string }>(JSON.parse(manifest)), item => item.name)['echarts'][0]
    const html = htmlRaw
      .replace('{{theme}}', isDark ? 'dark' : 'light')
      .replace('{{runtime}}', new URL(`/embed/${file}`, process.env.NEXT_PUBLIC_WEBSITE_URL).href)
    const blob = new Blob([html], { type: 'text/html' })
    const _url = URL.createObjectURL(blob)
    setUrl(_url)

    return () => {
      URL.revokeObjectURL(_url)
    }
  }, [isDark])

  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    iframe.contentWindow?.postMessage(options, '*')

    const handleMessage = (event: MessageEvent) => {
      switch (event.data.type) {
        case 'echarts-mounted':
          iframe.contentWindow?.postMessage(options, '*')
          break
      }
    }
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [options])

  if (!url) return null

  return (
    <iframe
      ref={iframeRef}
      className={cn('size-full bg-transparent', className)}
      sandbox="allow-scripts"
      src={url}
      onLoad={() => {
        iframeRef.current?.contentWindow?.postMessage(options, '*')
      }}
    />
  )
}
