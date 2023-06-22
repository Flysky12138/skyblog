import { LyricGetResponseType } from '@/app/api/music/neteasecloud/lyric/route'
import { cn } from '@/lib/cn'
import { Live2DContext } from '@/provider/live2d'
import { AnimatePresence, AnimationProps, motion } from 'framer-motion'
import React from 'react'

export interface LyricRef {
  setProgress: (second: number) => void
}

interface LyricProps {
  className?: string
  value: LyricGetResponseType['lrc']
}

export default React.forwardRef<LyricRef, LyricProps>(function Lyric({ className, value: lyric }, ref) {
  const [showLyric, setShowLyric] = React.useState('')

  const { setMessage } = React.useContext(Live2DContext)

  // 输入时间进度，显示对应歌词
  React.useImperativeHandle(ref, () => ({
    setProgress: second => {
      React.startTransition(() => {
        if (!lyric) return
        const index = lyric.findLastIndex(({ time }) => time <= second)
        const currentLyric = lyric[index].lyric
        if (!currentLyric) return
        setShowLyric(currentLyric)
        setMessage({
          content: `♪ ${currentLyric}`,
          priority: 1000,
          timeout: 10000
        })
      })
    }
  }))

  if (!lyric) return null
  if (!showLyric) return null

  const animationProps: AnimationProps = {
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    initial: { opacity: 0, y: 10 }
  }

  return (
    <AnimatePresence>
      <motion.section
        className={cn(
          'rounded-t-lg border-b border-dashed px-2 py-1 text-center',
          'dark:border-stone-600',
          'text-sky-600 dark:text-sky-400',
          'bg-white dark:bg-[#231f1d]',
          className
        )}
        transition={{ duration: 0.2, type: 'tween' }}
        {...animationProps}
      >
        <motion.p key={showLyric} {...animationProps}>
          {showLyric}
        </motion.p>
      </motion.section>
    </AnimatePresence>
  )
})
