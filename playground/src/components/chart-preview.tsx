import '@repo/ui/globals.css'
import { ChartPreview } from '@repo/chart-preview'
import { Card } from '@repo/ui/components/card'

import chartOption from '../assets/chart-option.json?raw'

export function ChartPreviewPlayground() {
  return (
    <Card className="h-full p-6">
      <ChartPreview content={`option = ${chartOption}`} />
    </Card>
  )
}
