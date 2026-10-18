import '@repo/ui/globals.css'
import { ChartPreview } from '@repo/chart-preview'
import { ThemeToggle } from '@repo/components/theme'

import chartOption from './chart-option.json?raw'

export function App() {
  return (
    <div className="h-screen">
      <ThemeToggle className="fixed top-2 right-2" />
      <ChartPreview className="" content={`option = ${chartOption}`} />
    </div>
  )
}
