'use client'

import * as echarts from 'echarts'
import { EChartsCoreOption } from 'echarts'
import React from 'react'
import { useDebounce, useWindowSize } from 'react-use'
import { ModuleKind, ScriptTarget, transpile } from 'typescript'

import { MonacoEditor } from '@/components/monaco-editor'
import { tsEchartsConfig } from '@/components/monaco-editor/languages/ts-echarts'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useEcharts } from '@/hooks/use-echarts'

import { FullMain } from '../_components/full-main'

export default function Page() {
  const [code, setCode] = React.useState(DEFAULT_OPTION)

  const { width } = useWindowSize()
  const [divRef, { echarts }] = useEcharts<HTMLDivElement>()

  useDebounce(() => echarts.current?.setOption(getOptions(code), true, true), 800, [code, echarts])

  return (
    <FullMain>
      <ResizablePanelGroup
        direction={width < 1024 ? 'vertical' : 'horizontal'}
        onLayout={() => {
          echarts.current?.resize()
        }}
      >
        <ResizablePanel>
          <MonacoEditor
            code={code}
            options={{
              minimap: {
                enabled: false
              }
            }}
            onChange={payplod => {
              setCode(payplod || '')
            }}
            {...tsEchartsConfig}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div ref={divRef} className="size-full" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </FullMain>
  )
}

const getOptions = (code: string): EChartsCoreOption => {
  try {
    const transpiledCode = transpile(`${code}; return option;`, {
      module: ModuleKind.None,
      target: ScriptTarget.ES2015
    })
    return new Function('echarts', transpiledCode)(echarts)
  } catch (error) {
    return {}
  }
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
