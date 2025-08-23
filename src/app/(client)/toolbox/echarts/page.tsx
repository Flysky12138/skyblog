'use client'

import * as echarts from 'echarts'
import { ECharts, EChartsCoreOption } from 'echarts'
import React from 'react'
import { useDebounce } from 'react-use'
import { ModuleKind, ScriptTarget, transpile } from 'typescript'
import { useImmer } from 'use-immer'

import { MonacoEditor } from '@/components/monaco-editor'
import { tsEchartsConfig } from '@/components/monaco-editor/languages/ts-echarts'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

export default function Page() {
  const [code, setCode] = useImmer(DEFAULT_OPTION)

  const id = React.useId()
  const echartsRef = React.useRef<ECharts>(null)

  React.useEffect(() => {
    echartsRef.current = echarts.init(document.getElementById(id))
    return () => {
      echartsRef.current?.dispose()
    }
  }, [id])

  useDebounce(() => echartsRef.current?.setOption(getOptions(code), true), 800, [code])

  return (
    <div className="h-main bg-card">
      <style>{`
        main [data-slot="container"] { padding: 0;
          max-width: none;
        }
      `}</style>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={() => {
          echartsRef.current?.resize()
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
          <div className="size-full" id={id} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
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
