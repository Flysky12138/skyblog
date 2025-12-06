import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  build: {
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true,
    manifest: true,
    outDir: new URL('../public/embed', import.meta.url).pathname,
    target: 'es2020',
    rollupOptions: {
      input: {
        echarts: new URL('./echarts.ts', import.meta.url).pathname
      },
      output: {
        entryFileNames: '[name].[hash].js',
        format: 'iife'
      }
    }
  }
})
