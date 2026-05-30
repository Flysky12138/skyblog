import * as echarts from 'echarts'
import { ECharts, EChartsInitOpts } from 'echarts'
import React from 'react'
import { useEvent } from 'react-use'

export const useEcharts = <T extends HTMLElement>(options?: EChartsInitOpts) => {
  const domRef = React.useRef<T>(null)
  const chartRef = React.useRef<ECharts>(null)

  const resetChart = React.useCallback((newOptions?: EChartsInitOpts) => {
    const el = domRef.current
    if (!el) return
    try {
      // 先 init，成功后再 dispose 旧实例，避免 init 失败后旧实例也被销毁
      const chart = echarts.init(el, null, newOptions)
      chartRef.current?.dispose()
      chartRef.current = chart
    } catch (error) {
      console.error('echarts init failed:', error)
    }
  }, [])

  React.useEffect(() => {
    resetChart(options)
    return () => {
      chartRef.current?.dispose()
    }
  }, [options, resetChart])

  useEvent('resize', () => {
    chartRef.current?.resize()
  })

  return [
    domRef,
    {
      chartRef,
      resetChart
    }
  ] as const
}
