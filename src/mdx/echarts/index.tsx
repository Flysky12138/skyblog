'use client'

import { MonacoEditor } from '@/components/monaco-editor'
import { tsEchartsConfig } from '@/components/monaco-editor/languages/ts-echarts'
import * as echarts from 'echarts'
import { ECharts } from 'echarts'
import React from 'react'
import { useDebounce, useMeasure } from 'react-use'
import { ModuleKind, ScriptTarget, transpile } from 'typescript'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'ui/resizable'
import { useImmer } from 'use-immer'

interface EchartsProps {
  children?: {
    props: {
      children?: string
    }
  }
}

export default function Echarts({ children }: EchartsProps) {
  const id = React.useId()
  const [code, setCode] = useImmer(atob(children?.props?.children || btoa('option = {}')))
  const echartsRef = React.useRef<ECharts>(null)
  const [height, setHeight] = React.useState(600)

  React.useLayoutEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    setHeight(main.clientHeight - 9 * 4 * 2)
  }, [])

  React.useEffect(() => {
    echartsRef.current = echarts.init(document.getElementById(id))
    return () => {
      echartsRef.current?.dispose()
    }
  }, [id])

  useDebounce(() => echartsRef.current?.setOption(getOptions(code), true), 800, [code])

  const [containerRef, { height: h, width: w }] = useMeasure<HTMLElement>()
  React.useEffect(() => {
    echartsRef.current?.resize()
  }, [w, h])

  return (
    <section ref={containerRef} className="post-full-page:h-full!" style={{ height }}>
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
    const transpiledCode = transpile(`${code}; return option;`, {
      module: ModuleKind.None,
      target: ScriptTarget.ES2015
    })
    return new Function('echarts', transpiledCode)(echarts)
  } catch (error) {
    return {}
  }
}
