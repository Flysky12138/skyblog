'use client'

import * as echarts from 'echarts'
import { EChartsInitOpts } from 'echarts'
import React from 'react'
import { useWindowSize } from 'react-use'
import { toast } from 'sonner'
import { ModuleKind, ScriptTarget, transpile } from 'typescript'

import { MonacoEditor } from '@/components/monaco-editor'
import { tsEchartsConfig } from '@/components/monaco-editor/languages/ts-echarts'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useEcharts } from '@/hooks/use-echarts'

export default function Page() {
  const [code, setCode] = React.useState(DEFAULT_OPTION)
  const deferredCode = React.useDeferredValue(code)

  const { width } = useWindowSize()
  const [divRef, { chartRef, resetChart }] = useEcharts<HTMLDivElement>()

  const id = React.useRef<number | string>(0)

  React.useEffect(() => {
    if (!chartRef.current) return

    const doUpdate = () => {
      try {
        chartRef.current?.setOption(getOptions(deferredCode), true, true)
        toast.dismiss(id.current)
      } catch (error) {
        resetChart()
        id.current = toast.error('Error updating chart', {
          description: (error as Error).message,
          dismissible: false,
          duration: Infinity,
          id: '019b3653-c75a-74d3-8479-cde83fd7acb4',
          richColors: true
        })
      }
    }

    let rafId = window.requestAnimationFrame(() => {
      rafId = window.requestAnimationFrame(doUpdate)
    })

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [chartRef, deferredCode, resetChart])

  return (
    <ResizablePanelGroup
      direction={width < 1024 ? 'vertical' : 'horizontal'}
      onLayout={() => {
        chartRef.current?.resize()
      }}
    >
      <ResizablePanel>
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
      <ResizablePanel>
        <div ref={divRef} className="size-full" />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

const getOptions = (code: string): EChartsInitOpts => {
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
