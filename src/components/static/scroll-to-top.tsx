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

export const ScrollToTop = ({ className, showOnScrollYOverflow = 200, ...props }: ScrollToTopProps) => {
  const isMounted = useMounted()

  const [showProgress, setShowProgress] = React.useState(false)

  const { y, yProgress } = useWindowScrollState()

  const timer = React.useRef<NodeJS.Timeout>(undefined)
  React.useEffect(() => {
    clearTimeout(timer.current)
    setShowProgress(true)
    timer.current = setTimeout(setShowProgress, 500, false)
  }, [yProgress])

  if (!isMounted) return null
  if (y <= showOnScrollYOverflow) return null

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
