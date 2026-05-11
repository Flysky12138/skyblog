import * as echarts from 'echarts'

console.log('[Sandbox] echarts runtime loaded')

if (window.self == window.top) {
  throw new Error('Sandbox is not allowed to access the parent window.')
}

const root = document.getElementById('root')!
const errorMessage = document.getElementById('error-message')!

let echartsRef: echarts.ECharts | null = null

window.addEventListener('message', (event: MessageEvent<string>) => {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function('echarts', `try { let option = {}; ${event.data}; return option } catch {}`)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const option = fn(echarts) as echarts.EChartsOption

  try {
    echartsRef ??= echarts.init(root)
    echartsRef?.setOption(option)
    errorMessage.textContent = ''
  } catch (error) {
    echartsRef?.dispose()
    echartsRef = null
    errorMessage.textContent = error instanceof Error ? error.message : String(error)
  }
})

window.addEventListener('resize', () => {
  echartsRef?.resize()
})
