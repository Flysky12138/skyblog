'use client'

import React from 'react'

import { useTheme } from '@/hooks/use-theme'

import { Fish } from './fish'

export const FishCanvas = () => {
  const fishRef = React.useRef<Fish>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    if (canvasRef.current) {
      fishRef.current = new Fish(canvasRef.current)
    }
    return () => {
      fishRef.current?.destroy()
    }
  }, [])

  const { isDark } = useTheme()
  React.useEffect(() => {
    if (fishRef.current) {
      fishRef.current.context.fillStyle = isDark ? 'hsl(0, 0%, 30%)' : 'hsl(0, 0%, 93%)'
    }
  }, [isDark])

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
}
