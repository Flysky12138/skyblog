import { LyricGetResponseType } from '@/app/api/music/neteasecloud/lyric/route'
import { cn } from '@/lib/cn'
import { CustomFetch } from '@/lib/server/fetch'
import { Live2DContext } from '@/provider/live2d'
import { AnimatePresence, AnimationProps, motion } from 'framer-motion'
import React from 'react'
import { useImmer } from 'use-immer'
import { Player } from './index'

const getLyric = async (id: number) => {
  return await CustomFetch<LyricGetResponseType>(`/api/music/neteasecloud/lyric?id=${id}`)
}

export interface LyricRef {
  setProgress: (second: number) => void
}
interface LyricProps {
  className?: string
  id: number
  onLoad: (payload: Player['lyric']['has']) => void
  type: Player['lyric']['use']
}

export default React.forwardRef<LyricRef, LyricProps>(function Lyric({ className, id, type, onLoad }, ref) {
  const [lyric, setLyric] = useImmer<LyricGetResponseType | null>(null)
  const [showLyric, setShowLyric] = React.useState('')

  React.useEffect(() => {
    getLyric(id).then(res => {
      setLyric(res)
      onLoad({ klyric: !!res.klyric, lrc: !!res.lrc, romalrc: !!res.romalrc, tlyric: !!res.tlyric })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setLyric])

  const { setMessage } = React.useContext(Live2DContext)

  // 输入时间进度，显示对应歌词
  React.useImperativeHandle(ref, () => ({
    setProgress: second => {
      React.startTransition(() => {
        if (!type) return
        const lyrics = lyric?.[type] || lyric?.lrc
        if (!lyrics) return
        const index = lyrics.findLastIndex(({ time }) => time <= second)
        if (!lyrics[index].lyric) return
        setShowLyric(lyrics[index].lyric)
        setMessage({
          content: `♪ ${lyrics[index].lyric}`,
          priority: 1000,
          timeout: 10000
        })
      })
    }
  }))

  if (!type) return null
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
