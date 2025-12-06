import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true,
    manifest: true,
    outDir: new URL('../public/embed', import.meta.url).pathname,
    rollupOptions: {
      input: {
        echarts: new URL('./echarts.ts', import.meta.url).pathname
      },
      output: {
        entryFileNames: '[name].[hash].js',
        format: 'iife'
      }
    },
    target: 'es2020'
  },
  publicDir: false
})
