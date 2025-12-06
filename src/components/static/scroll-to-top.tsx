'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { useMounted } from '@/hooks/use-mounted'
import { useWindowScrollState } from '@/hooks/use-window-scroll-state'
import { cn } from '@/lib/utils'

interface ScrollToTopProps extends React.ComponentProps<typeof Button> {
  /**
   * 滚动超出多少才显示
   * @default 200
   */
  showOnScrollYOverflow?: number
}

export function ScrollToTop({ className, showOnScrollYOverflow = 200, ...props }: ScrollToTopProps) {
  const [showProgress, setShowProgress] = React.useState(false)

  const isMounted = useMounted()
  const { y, yProgress } = useWindowScrollState()

  React.useEffect(() => {
    setShowProgress(true)
    const timer = setTimeout(() => {
      setShowProgress(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [yProgress])

  const handleClick = React.useEffectEvent(() => {
    if (showProgress) return
    const realStart = window.scrollY
    const start = Math.min(realStart, 700)

    const duration = 450
    const startTime = performance.now()

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)

      const current = start * (1 - eased)
      window.scrollTo(0, current)

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  })

  if (!isMounted) return null
  if (y <= showOnScrollYOverflow) return null

  return (
    <Button
      aria-label="scroll back to top"
      className={cn('relative p-4 select-none', className, {
        'cursor-default': showProgress
      })}
      size="icon"
      onClick={handleClick}
      {...props}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {showProgress ? (
          <motion.div key={1} animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
            {yProgress}
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
