import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/iframe/index.ts',
  format: 'iife',
  minify: true,
  platform: 'browser',
  shims: true,
  target: 'es2022',
  deps: {
    alwaysBundle: ['echarts'],
    onlyBundle: ['tslib', 'zrender', 'echarts']
  },
  outputOptions: {
    globals: {
      echarts: 'echarts'
    }
  }
})
