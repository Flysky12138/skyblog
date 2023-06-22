'use client'

import { Button } from '@/components/ui/button'
import { useLive2DContext } from '@/providers/live2d'
import { Bot, BotOff } from 'lucide-react'

export const ToggleLive2D = () => {
  const { enable, setEnable, loading, src } = useLive2DContext()

  if (!src) return null

  return (
    <Button disabled={loading} size="icon" variant="outline" onClick={() => setEnable(!enable)}>
      {enable ? <Bot /> : <BotOff />}
    </Button>
  )
}
