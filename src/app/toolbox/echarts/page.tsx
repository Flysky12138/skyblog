'use client'

import React from 'react'
import { useDebounce, useWindowSize } from 'react-use'
import { transform } from 'sucrase'

import { MonacoEditor } from '@/components/monaco-editor'
import { tsEchartsConfig } from '@/components/monaco-editor/languages/ts-echarts'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

import { EchartsPreview } from './_components/echarts-preview'

export default function Page() {
  const [code, setCode] = React.useState(DEFAULT_OPTION)
  const [options, setOptions] = React.useState(code)

  const { width } = useWindowSize()

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

const DEFAULT_OPTION = `
option = {
  tooltip: {},
  angleAxis: [
    {
      type: 'category',
      polarIndex: 0,
      startAngle: 90,
      endAngle: 0,
      data: ['S1', 'S2', 'S3']
    },
    {
      type: 'category',
      polarIndex: 1,
      startAngle: -90,
      endAngle: -180,
      data: ['T1', 'T2', 'T3']
    }
  ],
  radiusAxis: [{ polarIndex: 0 }, { polarIndex: 1 }],
  polar: [{}, {}],
  series: [
    {
      type: 'bar',
      polarIndex: 0,
      data: [1, 2, 3],
      coordinateSystem: 'polar'
    },
    {
      type: 'bar',
      polarIndex: 1,
      data: [1, 2, 3],
      coordinateSystem: 'polar'
    }
  ]
}
`
