import * as echarts from 'echarts'
import { ECharts, EChartsInitOpts } from 'echarts'
import React from 'react'
import { useEvent } from 'react-use'

export const useEcharts = <T extends HTMLElement>(options?: EChartsInitOpts) => {
  const domRef = React.useRef<T>(null)
  const echartsRef = React.useRef<ECharts>(null)

  useEvent('resize', () => {
    echartsRef.current?.resize()
  })

  React.useEffect(() => {
    echartsRef.current = echarts.init(domRef.current, null, options)
    return () => {
      echartsRef.current?.dispose()
    }
  }, [options])

  return [
    domRef,
    {
      echarts: echartsRef
    }
  ] as const
}
