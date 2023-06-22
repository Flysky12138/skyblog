'use client'

import useTheme from '@/hooks/useTheme'
import React from 'react'
import fish from './fish'

export default function Fish() {
  const fishRef = React.useRef<fish>()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    if (canvasRef.current) {
      fishRef.current = new fish(canvasRef.current)
    }
    return () => {
      fishRef.current?.destroy()
    }
  }, [])

  // 颜色切换
  const { isDark } = useTheme()
  React.useEffect(() => {
    if (fishRef.current) {
      fishRef.current.context.fillStyle = isDark ? 'hsl(0, 0%, 30%)' : 'hsl(0, 0%, 93%)'
    }
  }, [isDark])

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10"></canvas>
}
