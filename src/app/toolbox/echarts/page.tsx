'use client'

import React from 'react'
import { useDebounce, useWindowSize } from 'react-use'
import { transform } from 'sucrase'

import { MonacoEditor } from '@/components/monaco-editor'
import { tsEchartsConfig } from '@/components/monaco-editor/languages/ts-echarts'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useMounted } from '@/hooks/use-mounted'

import { EchartsPreview } from './_components/echarts-preview'
import { DEFAULT_OPTION } from './utils'

export default function Page() {
  const [code, setCode] = React.useState(DEFAULT_OPTION)
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
          options={{
            minimap: {
              enabled: false
            }
          }}
          value={code}
          onChange={setCode}
          {...tsEchartsConfig}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <EchartsPreview options={options} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
