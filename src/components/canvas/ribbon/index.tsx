'use client'

import React from 'react'

import { Ribbon } from './ribbon'

export const RibbonCanvas = () => {
  const ribbonRef = React.useRef<Ribbon>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    if (canvasRef.current) {
      ribbonRef.current = new Ribbon(canvasRef.current, {
        parallaxAmount: 0,
        ribbonCount: 3
      })
    }
    return () => {
      ribbonRef.current?.destroy()
    }
  }, [])

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 [clip-path:inset(0)]">
      <canvas ref={canvasRef} className="fixed inset-0" />
    </div>
  )
}
