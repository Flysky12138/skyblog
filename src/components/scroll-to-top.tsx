'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import React from 'react'
import { Button } from 'ui/button'

import { cn } from '@/lib/utils'

interface ScrollToTopProps extends React.ComponentProps<typeof Button> {
  /**
   * @default 200
   */
  showOnScrollYOverflow?: number
}

export const ScrollToTop = ({ className, showOnScrollYOverflow = 200, ...props }: ScrollToTopProps) => {
  const [showProgress, setShowProgress] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const { scrollY, scrollYProgress } = useScroll()
  const timer = React.useRef<NodeJS.Timeout>(undefined)
  useMotionValueEvent(scrollYProgress, 'change', value => {
    clearTimeout(timer.current)
    setProgress(value)
    setShowProgress(true)
    timer.current = setTimeout(setShowProgress, 500, false)
  })

  if (scrollY.get() <= showOnScrollYOverflow) return null

  return (
    <Button
      aria-label="Scroll back to top"
      className={cn('relative p-4 select-none', className, {
        'cursor-default': showProgress
      })}
      size="icon"
      onClick={() => {
        if (showProgress) return
        window.scrollTo({ behavior: 'smooth', top: 0 })
      }}
      {...props}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {showProgress ? (
          <motion.div key={1} animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
            {Math.round(progress * 100)}
          </motion.div>
        ) : (
          <motion.div key={2} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} initial={{ opacity: 0, y: 15 }}>
            <ChevronUp strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
