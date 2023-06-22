'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import React from 'react'

export const ScrollToTop = () => {
  const [showProgress, setShowProgress] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const { scrollYProgress, scrollY } = useScroll()
  const timer = React.useRef<NodeJS.Timeout>(undefined)
  useMotionValueEvent(scrollYProgress, 'change', value => {
    clearTimeout(timer.current)
    setProgress(value)
    setShowProgress(true)
    timer.current = setTimeout(setShowProgress, 500, false)
  })

  if (scrollY.get() <= 200) return null

  return (
    <Button
      aria-label="Scroll back to top"
      className={cn('relative p-4 select-none', {
        'cursor-default': showProgress
      })}
      size="icon"
      onClick={() => {
        if (showProgress) return
        window.scrollTo({ behavior: 'smooth', top: 0 })
      }}
    >
      <AnimatePresence initial={false}>
        {showProgress ? (
          <motion.div key={1} animate={{ opacity: 1 }} className="absolute" exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
            {(progress * 100) >> 0}
          </motion.div>
        ) : (
          <motion.div key={2} animate={{ opacity: 1, y: 0 }} className="absolute" exit={{ opacity: 0 }} initial={{ opacity: 0, y: 15 }}>
            <ChevronUp strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
