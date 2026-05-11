import { DropdownMenuThemeRadio, ThemeProvider } from '@repo/ui/components-self/theme'
import { Button } from '@repo/ui/components/button'
import { RefreshCcwIcon } from 'lucide-react'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { ChartPreviewPlayground } from './components/chart-preview'
import { MDXPlayground } from './components/mdx'
import { MonacoEditorPlayground } from './components/monaco-editor'

function App() {
  const [key, setKey] = React.useState(0)

  const Comp = React.useMemo(() => {
    switch (import.meta.env.VITE_APP_PACKAGE) {
      case 'chart-preview':
        return <ChartPreviewPlayground />
      case 'mdx':
        return <MDXPlayground />
      case 'monaco-editor':
        return <MonacoEditorPlayground />
      default:
        return null
    }
  }, [])

  return (
    <div className="relative h-dvh w-full p-20">
      <div className="fixed inset-e-5 inset-bs-5 space-x-3">
        <DropdownMenuThemeRadio />
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            setKey(key ^ 1)
          }}
        >
          <RefreshCcwIcon />
        </Button>
      </div>
      <div key={key} className="size-full">
        {Comp}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
