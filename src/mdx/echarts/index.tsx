'use client'

import { MonacoEditor } from '@/components/monaco-editor'
import { tsEchartsConfig } from '@/components/monaco-editor/languages/ts-echarts'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import * as echarts from 'echarts'
import { ECharts } from 'echarts'
import React from 'react'
import { useDebounce, useEvent } from 'react-use'
import { ModuleKind, ScriptTarget, transpile } from 'typescript'
import { useImmer } from 'use-immer'

const DEFAULT_OPTION = `let base = +new Date(1968, 9, 3)
const oneDay = 24 * 3600 * 1000
const date = []
const data = [Math.random() * 300]
for (let i = 1; i < 20000; i++) {
  const now = new Date((base += oneDay))
  date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'))
  data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]))
}

option = {
  title: {
    left: 'center',
    padding: [10, 0, 0, 0],
    text: 'Large Area Chart'
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: date
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%']
  },
  dataZoom: [
    { type: 'inside', start: 0, end: 100 },
    { start: 0, end: 100 }
  ],
  series: {
    name: 'Fake Data',
    type: 'line',
    symbol: 'none',
    sampling: 'lttb',
    itemStyle: {
      color: 'rgb(255, 70, 131)'
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgb(255, 158, 68)' },
        { offset: 1, color: 'rgb(255, 70, 131)' }
      ])
    },
    data
  }
}
`

export default function Echarts() {
  const id = React.useId()
  const [code, setCode] = useImmer(DEFAULT_OPTION)
  const echartsRef = React.useRef<ECharts>(null)
  const [height, setHeight] = React.useState(600)

  useDebounce(() => echartsRef.current?.setOption(getOptions(code), true), 800, [code])

  React.useEffect(() => {
    echartsRef.current = echarts.init(document.getElementById(id))
    return () => {
      echartsRef.current?.dispose()
    }
  }, [id])

  useEvent('resize', () => {
    setTimeout(() => {
      echartsRef.current?.resize()
    })
  })

  React.useLayoutEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    setHeight(main.clientHeight - 9 * 4 * 2)
  }, [])

  return (
    <section className="post-full-page:h-full!" style={{ height }}>
      <style>{`article { padding: 0 }`}</style>
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
    </section>
  )
}

const getOptions = (code: string) => {
  try {
    return new Function(
      'echarts',
      transpile(`${code};return option;`, {
        module: ModuleKind.None,
        target: ScriptTarget.ES2015
      })
    )(echarts)
  } catch (error) {
    return {}
  }
}
