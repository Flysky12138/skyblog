'use client'

import { ChartPreview } from '@repo/chart-preview'
import { MonacoEditor } from '@repo/monaco-editor'
import { useMounted } from '@repo/react-hooks'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@repo/ui/components/resizable'
import React from 'react'
import { useDebounce, useWindowSize } from 'react-use'
import { transform } from 'sucrase'

import { ECHARTS_TEMPLATE, onInit } from './utils'

// predev 时创建软连接，prebuild 时复制
const cdnUrl = new URL('/chart-preview/index.iife.js', process.env.NEXT_PUBLIC_WEBSITE_URL).href

export default function Page() {
  const [code, setCode] = React.useState(ECHARTS_TEMPLATE)
  const [options, setOptions] = React.useState(code)

  const { width } = useWindowSize()
  const isMounted = useMounted()

  const getOptions = () => {
    try {
      return transform(code, { transforms: ['typescript'] }).code
    } catch {
      return '{}'
    }
  }

  useDebounce(
    () => {
      React.startTransition(() => {
        setOptions(getOptions())
      })
    },
    100,
    [code]
  )

  if (!isMounted) return null

  return (
    <ResizablePanelGroup orientation={width < 1024 ? 'vertical' : 'horizontal'}>
      <ResizablePanel defaultSize="50%" maxSize="80%" minSize="20%">
        <MonacoEditor
          unstyled
          language="typescript"
          options={{
            minimap: {
              enabled: false
            }
          }}
          value={code}
          onChange={setCode}
          onInit={onInit}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50%">
        <ChartPreview cdnUrl={cdnUrl} content={options} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
