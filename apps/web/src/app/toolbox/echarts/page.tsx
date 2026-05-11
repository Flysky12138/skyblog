'use client'

import { ChartPreview } from '@repo/chart-preview'
import manifest from '@repo/chart-preview/dist/.vite/manifest.json'
import { MonacoEditor } from '@repo/monaco-editor'
import { useDebounce, useMounted, useWindowSize } from '@repo/react-hooks'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@repo/ui/components/resizable'
import React from 'react'
import { transform } from 'sucrase'

import { ECHARTS_TEMPLATE, onInit } from './utils'

// predev 时创建软连接，prebuild 时复制
const cdnUrl = new URL(`/chart-preview/${manifest['src/iframe/index.ts'].file}`, process.env.NEXT_PUBLIC_WEBSITE_URL).href

export default function Page() {
  const [code, setCode] = React.useState(ECHARTS_TEMPLATE)
  const [options, setOptions] = React.useState(code)

  const { width } = useWindowSize()
  const isMounted = useMounted()

  const getOptions = React.useEffectEvent(() => {
    try {
      return transform(code, { transforms: ['typescript'] }).code
    } catch {
      return '{}'
    }
  })

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
      <ResizablePanel defaultSize={50}>
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
      <ResizablePanel defaultSize={50}>
        <ChartPreview cdnUrl={cdnUrl} content={options} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
