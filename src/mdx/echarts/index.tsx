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

interface EchartsProps {
  children?: {
    props: {
      children?: string
    }
  }
}

export default function Echarts({ children }: EchartsProps) {
  const id = React.useId()
  const [code, setCode] = useImmer(atob(children?.props?.children || btoa('{}')))
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
