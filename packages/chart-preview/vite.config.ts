import { defineConfig } from 'vite'

// https://cn.vite.dev/config/
export default defineConfig({
  publicDir: false,
  build: {
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true,
    manifest: true,
    target: 'es2022',
    rollupOptions: {
      input: {
        echarts: new URL('./src/iframe/index.ts', import.meta.url).pathname
      },
      output: {
        entryFileNames: '[name].[hash].js',
        format: 'iife'
      }
    }
  }
})
