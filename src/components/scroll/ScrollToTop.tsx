'use client'

import { cn } from '@/lib/cn'
import { ExpandLessRounded } from '@mui/icons-material'
import { IconButton } from '@mui/joy'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import React from 'react'

export default function ScrollToTop() {
  const [showProgress, setShowProgress] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const { scrollYProgress, scrollY } = useScroll()
  const timer = React.useRef<NodeJS.Timeout>()
  useMotionValueEvent(scrollYProgress, 'change', value => {
    clearTimeout(timer.current)
    setProgress(value)
    setShowProgress(true)
    timer.current = setTimeout(setShowProgress, 500, false)
  })

  if (scrollY.get() <= 200) return null

  return (
    <IconButton
      aria-label="Scroll back to top"
      className={cn('select-none bg-sky-400 dark:bg-sky-600', {
        'cursor-default': showProgress
      })}
      variant="solid"
      onClick={() => {
        if (showProgress) return
        window.scrollTo({ behavior: 'smooth', top: 0 })
      }}
    >
      <AnimatePresence initial={false}>
        {showProgress ? (
          <motion.div key={1} animate={{ opacity: 1 }} className="absolute leading-[0]" exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
            {(progress * 100) >> 0}
          </motion.div>
        ) : (
          <ExpandLessRounded
            key={2}
            animate={{ opacity: 1, y: 0 }}
            className="absolute leading-[0]"
            component={motion.svg}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: 15 }}
          />
        )}
      </AnimatePresence>
    </IconButton>
  )
}
