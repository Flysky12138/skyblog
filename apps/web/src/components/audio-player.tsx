'use client'

import { useAudio } from '@repo/react-hooks'
import { Button } from '@repo/ui/components/button'
import { Slider } from '@repo/ui/components/slider'
import { Toggle } from '@repo/ui/components/toggle'
import { cn } from '@repo/ui/lib/utils'
import { clamp, noop } from 'es-toolkit'
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon, PauseIcon, PlayIcon, Repeat1Icon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React from 'react'

import { LyricResponseType, SongDetailResponseType } from '@/app/api/[[...elysia]]/client/netease-cloud-music/songs/model'
import { Show } from '@/components/show'
import { TimeHelper } from '@/lib/helper/time'

export interface AudioPlayerProps {
  autoplay?: boolean
  className?: string
  loading?: boolean
  lyric: LyricResponseType['lyric']
  song: SongDetailResponseType
  src: string
  onNext?: () => void
  onPrev?: () => void
}

export function AudioPlayer({ autoplay, className, loading, lyric, song, src, onNext, onPrev }: AudioPlayerProps) {
  const [loop, setLoop] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const [sliderValue, setSliderValue] = React.useState(0)

  const { audioRef, currentTime, duration, play, playing, seek, toggle } = useAudio(src)

  const displayTime = Number.isFinite(currentTime) ? currentTime * 1000 : 0
  const displayDuration = Number.isFinite(duration) ? duration * 1000 : 0

  // 当前进度的歌词
  const currentLyric = React.useMemo(() => {
    if (!lyric) return null
    const index = lyric.findLastIndex(item => item.time <= currentTime)
    return lyric[clamp(index, 0, lyric.length - 1)]?.text
  }, [currentTime, lyric])

  const handleOnNext = React.useEffectEvent(onNext ?? noop)
  const handlePlay = React.useEffectEvent(play ?? noop)

  // 单曲循环时，播放完毕后重新播放
  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleCanplay = () => {
      if (!autoplay) return
      void handlePlay()
    }
    const handleEnded = () => {
      if (loop) {
        void handlePlay()
      } else {
        handleOnNext()
      }
    }

    audio.addEventListener('canplay', handleCanplay)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('canplay', handleCanplay)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioRef, autoplay, loop])

  return (
    <section aria-label="audio player" className={className}>
      <div className="relative">
        <img alt={song.name} className="w-full" height={720} src={song.al.picUrl.replace('http:', 'https:') + '?param=720y720'} width={720} />
        <AnimatePresence initial={false} mode="wait">
          <motion.p
            key={currentLyric}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 w-full p-2 text-center break-all"
            exit={{ opacity: 0, y: 10 }}
            initial={{ opacity: 0, y: 10 }}
          >
            {currentLyric}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="bg-card p-6">
        <p className="space-x-2">
          <span className="truncate text-xl leading-0">{song.name}</span>
          <span className="shrink-0 text-sm leading-0">{song.ar[0]?.name}</span>
        </p>

        <Slider
          className={cn(
            'mt-5',
            '**:data-[slot=slider-range]:bg-transparent **:data-[slot=slider-range]:bg-linear-to-r',
            '**:data-[slot=slider-range]:from-transparent **:data-[slot=slider-range]:to-primary'
          )}
          max={displayDuration || 0.1}
          value={[isDragging ? sliderValue : displayTime]}
          onValueChange={value => {
            setIsDragging(true)
            setSliderValue(value as number)
          }}
          onValueCommitted={value => {
            seek((value as number) / 1000)
            setTimeout(() => {
              setIsDragging(false)
            }, 60)
          }}
        />

        <p className="mt-2 flex justify-between text-xs">
          <span>{TimeHelper.formatMillisecond(displayTime)}</span>
          <span>{TimeHelper.formatMillisecond(displayDuration)}</span>
        </p>

        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div>
            <Toggle className="rounded-full aria-pressed:invert-100" pressed={loop} onPressedChange={setLoop}>
              <Repeat1Icon />
            </Toggle>
          </div>

          <div className="flex items-center gap-4">
            {onPrev && (
              <Button className="rounded-full" size="icon" variant="outline" onClick={onPrev}>
                <ChevronLeftIcon />
              </Button>
            )}
            <Button
              className="size-12 rounded-full p-0"
              disabled={loading}
              variant="outline"
              onClick={() => {
                void toggle()
              }}
            >
              <Show fallback={<Loader2Icon className="size-5 animate-spin" />} when={!loading}>
                <motion.div className="flex size-full items-center justify-center px-4 py-2" tabIndex={-1} whileTap={{ scale: 0.8 }}>
                  {playing ? <PauseIcon className="size-6" /> : <PlayIcon className="size-6" />}
                </motion.div>
              </Show>
            </Button>
            {onNext && (
              <Button className="rounded-full" size="icon" variant="outline" onClick={onNext}>
                <ChevronRightIcon />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
