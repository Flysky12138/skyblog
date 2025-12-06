'use client'

import { motion } from 'framer-motion'
import React from 'react'

import { Card } from '@/components/static/card'

const GAP = 0.2

export function CardWolf() {
  const divRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const [isMounted, setIsMounted] = React.useState(false)

  const draw = React.useEffectEvent(() => {
    const div = divRef.current
    const canvas = canvasRef.current

    if (!div || !canvas) return

    const width = div.offsetWidth

    const cellSize = width / grid[0].length

    canvas.width = width
    canvas.height = cellSize * grid.length

    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (!cell) return
        ctx.fillStyle = colors[cell]
        ctx.fillRect(x * cellSize + GAP, y * cellSize + GAP, cellSize - GAP * 2, cellSize - GAP * 2)
      })
    })
  })

  React.useEffect(() => {
    draw()
    setIsMounted(true)
    window.addEventListener('resize', draw)
    return () => {
      window.removeEventListener('resize', draw)
    }
  }, [])

  return (
    <Card className="overflow-hidden p-1 select-none">
      <motion.div
        ref={divRef}
        animate={isMounted ? 'visible' : 'hidden'}
        className="aspect-43/50"
        initial="hidden"
        variants={{
          hidden: {
            opacity: 0
          },
          visible: {
            opacity: 1
          }
        }}
      >
        <canvas ref={canvasRef} />
      </motion.div>
    </Card>
  )
}

// prettier-ignore
const grid = [
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"H5","H5","H5","H5","H5","H5","H5","H5",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,"H5","H5","H5","H5",null,null,null,null,null,null,null,null,null,null,"H5","H5","A25","A25","A25","A25","A25","A25","A25","A25","H5",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,"H5","H4","H3","H5","H5","H5","H5",null,null,null,null,"H5","H5","F18","G8","G8","G8","A25","A25","A25","A25","A25","A25","A25","H5",null,null,null,null,null,null,"H5","H5","H5","H5","H5","H5",null,null,null],
  [null,null,null,"H5","H14","H4","H3","H3","H3","H3","H5","H5",null,"H5","F18","F18","F18","F18","F18","F18","G8","G8","G8","A25","A25","A25","A25","A25","H5",null,null,null,"H5","H5","H3","H3","H3","H3","H4","H5",null,null,null],
  [null,null,null,null,"H5","H14","H4","H3","H3","H3","H3","H3","H5","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","G8","G8","A25","A25","A25","H5",null,"H5","H5","H3","H3","H3","H3","H3","H4","H14","H5",null,null,null],
  [null,null,null,null,"H5","H14","H4","H3","H3","H3","H3","H5","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","G8","G8","G8","H5","H5","H3","H3","H3","H3","H3","H3","H4","H14","H5",null,null,null,null],
  [null,null,null,null,null,"H5","H14","H4","H3","H3","H5","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F17","H5","H3","H3","H3","H3","H3","H3","H3","H4","H14","H5",null,null,null,null],
  [null,null,null,null,null,"H5","H14","H4","H3","H5","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F18","F17","F17","F17","F17","H5","H3","H3","H3","H3","H3","H3","H3","H4","H14","H14","H5",null,null,null,null],
  [null,null,null,null,null,null,"H5","H14","H4","H5","F17","F18","F18","F18","F18","F17","F17","F17","F17","F17","F17","F17","F17","H5","H5","H5","H5","H3","H3","H3","H3","H3","H3","H3","H3","H4","H14","H5",null,null,null,null,null],
  [null,null,null,null,null,null,"H5","H14","H4","H5","H5","F17","F17","F17","F17","H5","H5","H5","H5","H5","H5","H5","H5","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H4","H14","H5",null,null,null,null,null,null],
  [null,null,null,null,null,null,null,"H5","H14","H4","H7","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H3","H3","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H4","H14","H5",null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,"H5","H14","H7","H7","H7","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H7","H7","H7","H7","H7","H7","H3","H3","H3","H3","H3","H4","H14","H14","H5",null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,"H5","H7","H7","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H7","H7","H7","H7","H3","H3","H3","H3","H4","H14","H14","H5",null,null,null,null,null,null],
  [null,null,null,null,null,null,"H5","H5","H7","H7","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H7","H7","H3","H3","H3","H3","H4","H5",null,null,null,null,null,null,null],
  [null,null,null,null,null,"H5","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H7","H3","H3","H3","H3","H3","H5",null,null,null,null,null,null,null],
  [null,null,null,null,"H5","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5",null,null,null,null,null,null],
  [null,null,null,"H5","H3","H3","H4","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5",null,null,null,null,null],
  [null,null,"H5","H3","H3","H3","H4","H3","H7","H7","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5",null,null,null,null],
  [null,"H5","H3","H3","H3","H3","H4","H7","H7","H7","H7","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H7","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5",null,null,null],
  [null,null,"H5","H3","H3","H4","H4","H4","E17","H3","H3","H3","H7","H7","H7","H3","H3","H3","H3","H3","H3","H7","H7","H7","H7","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5",null,null],
  [null,null,null,"H5","H3","E17","H4","E17","E17","E17","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H7","H7","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5","H5",null],
  [null,null,"H5","H3","H3","E17","E17","H4","E17","E17","H3","H3","H3","H7","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5",null,null,null],
  [null,null,null,"H5","H3","H3","H4","H4","H4","H3","H3","H3","H7","H2","H2","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H3","H3","E17","E17","E17","E17","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5",null,null],
  [null,null,null,null,"H5","H3","H3","H4","H3","H3","H3","H3","H7","H7","H7","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H3","E17","E17","E17","E17","E17","E17","H3","H3","H3","H3","H3","H3","H3","H5",null,null,null],
  [null,null,null,null,null,"H5","H3","H4","H3","H3","H3","H3","H3","H7","H7","H7","H7","H7","H3","H3","H3","H3","H3","H3","H3","H3","E17","E17","E17","E17","E17","E17","H3","H3","H3","H3","H3","H3","H5",null,null,null,null],
  [null,null,null,null,null,"H5","H3","H3","H2","H2","H2","H2","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H2","H2","E17","E17","E17","E17","H3","H3","H3","H3","H3","H5","H5",null,null,null,null,null],
  [null,null,null,null,null,"H5","H3","H3","H7","H7","H7","H2","H2","H2","H2","H2","H2","H2","H2","H2","H2","H2","H2","H2","H2","H7","H2","H2","H2","H3","H3","H3","H3","H3","H5","H5",null,null,null,null,null,null,null],
  [null,null,null,null,null,"H5","H3","H3","H3","H7","H7","H7","H7","H7","H7","H7","H7","H7","H7","H7","H7","H7","H7","H7","H7","H7","H7","H7","H7","H3","H3","H3","H3","H5",null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,"H5","H3","H3","H3","H7","H7","H7","H7","H7","F17","F17","F17","H7","H7","F17","F17","F17","F17","F17","H7","H7","H7","H3","H3","H3","H3","H5",null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,"H5","H3","H3","H3","H2","H7","H7","H7","F17","F17","F17","F17","F17","F17","F17","F17","F17","F17","H2","H3","H3","H3","H3","H3","H5",null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,"H5","H5","H5","H3","H3","H3","H2","H2","H7","H7","F17","F17","F17","F17","F17","F17","F17","F17","H2","H3","H3","H3","H3","H3","H5",null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,"H5","H3","H3","H3","H5","H5","H3","H3","H3","H2","H2","H2","H2","H2","H2","H2","H2","H2","H2","H3","H3","H3","H3","H5","H5","H5","H5",null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,"H5","H3","H3","H3","H3","H3","H5","H5","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5","H5","H5","H5","H3","H3","H3","H3","H5","H5","H5","H5","H5",null,null,null,null,null,null],
  [null,null,null,null,null,null,"H5","H5","H5","H5","H3","H3","H3","H5","H5","H5","H5","H5","H5","H5","H5","H5","H5","H5","A25","A25","A25","A25","H5","H3","H3","H3","H3","H3","H3","H3","H5",null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,"H5","H5","H3","H5","A25","A25","A25","A25","A25","A25","A25","A25","A25","A25","A25","H5","H5","H5","H3","H3","H3","H3","H3","H3","H3","H5",null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,"H5","H5","A25","A25","A25","A25","A25","A25","A25","A25","A25","H5","H5","H3","H3","H3","H3","H3","H3","H5","H5","H5","H5","H9","H5",null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,"H5","H3","H5","A25","A25","A25","A25","A25","A25","H5","H5","H3","H3","H3","H3","H3","H3","H5","H5","H5","H9","H9","H9","H9","H5",null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,"H5","H3","H3","H5","A25","A25","A25","H5","H5","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5","H3","H3","H9","H9","H9","H5",null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,"H5","H3","H3","H3","H5","H5","H5","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5","H3","H9","H9","H9","H5",null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,"H5","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H4","H4","H4","H3","H3","H3","H5","H3","H3","H9","H9","H5",null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,"H5","H3","H3","H3","H3","H3","H3","H3","H4","H4","H4","H4","H3","H3","H3","H3","H3","H3","H5","H3","H3","H9","H9","H5",null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,"H5","H3","H3","H3","H3","H4","H4","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5","H3","H3","H9","H9","H5",null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,"H5","H3","H3","H3","H4","H3","H3","H3","H3","H3","H3","H3","H3","H3","H3","H5","H3","H3","H3","H3","H5",null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,"H5","H3","H3","H4","H3","H3","H3","H3","H3","H3","H3","H3","H5","H5","H5","H5","H5","H5","H5",null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"H5","H5","H3","H4","H4","H4","H4","H3","H3","H5","H5",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"H5","H5","H5","H5","H3","H3","H3","H3","H5",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"H5","H3","H3","H3","H3","H5",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"H5","H5","H5","H5",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
] as const

const colors: Record<NonNullable<(typeof grid)[number][number]>, string> = {
  A25: '#FADF72',
  E17: '#F6E6EF',
  F17: '#DB9F7F',
  F18: '#C78051',
  G8: '#6A4032',
  H2: '#FFFDFE',
  H3: '#BABABA',
  H4: '#878389',
  H5: '#46454B',
  H7: '#010101',
  H9: '#F2F1ED',
  H14: '#D8DFDE'
}
