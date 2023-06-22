'use client'

import React from 'react'
import ribbon from './ribbon'

export default function Ribbon() {
  const ribbonRef = React.useRef<ribbon>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    if (canvasRef.current) {
      ribbonRef.current = new ribbon(canvasRef.current, {
        parallaxAmount: 0,
        ribbonCount: 3
      })
    }
    return () => {
      ribbonRef.current?.destroy()
    }
  }, [])

  return (
    <section className="absolute inset-0 -z-10 [clip-path:inset(0)]">
      <canvas ref={canvasRef} className="fixed inset-0"></canvas>
    </section>
  )
}
