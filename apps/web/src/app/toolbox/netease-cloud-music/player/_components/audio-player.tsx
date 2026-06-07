'use client'

import { Button } from '@repo/ui/components/button'
import { Slider } from '@repo/ui/components/slider'
import { Toggle } from '@repo/ui/components/toggle'
import { cn } from '@repo/ui/lib/utils'
import { clamp } from 'es-toolkit'
import { Loader2Icon, PauseIcon, PlayIcon, Repeat1Icon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React from 'react'
import { useAudio } from 'react-use'

import { LyricResponseType, SongDetailResponseType } from '@/app/api/[[...elysia]]/client/netease-cloud-music/songs/model'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { TimeHelper } from '@/lib/helper/time'

export interface AudioPlayerProps {
  /**
   * 是否自动播放
   *
   * @default false
   */
  autoPlay?: boolean
  className?: string
  loading?: boolean
  lyric: LyricResponseType
  ref?: React.RefObject<AudioPlayerRef | null>
  song: SongDetailResponseType
  url: string
}

export interface AudioPlayerRef {
  controls: ReturnType<typeof useAudio>[2]
}

export function AudioPlayer({ autoPlay = false, className, loading = false, lyric, ref, song, url }: AudioPlayerProps) {
  const [loop, setLoop] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const [sliderValue, setSliderValue] = React.useState(0)

  const [audio, { paused, time }, controls] = useAudio({
    autoPlay: false,
    loop,
    // @ts-ignore
    src: url || undefined,
    onCanPlay: () => {
      if (autoPlay) {
        void controls.play()
      }
    }
  })

  // 切歌时重置进度条
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSliderValue(0)
    setIsDragging(false)
  }, [url, song.id])

  const displayTime = Number.isFinite(time) ? time * 1000 : 0
  const displayDuration = Number.isFinite(song.dt) ? song.dt : 0

  // 当前进度的歌词
  const currentLyric = React.useMemo(() => {
    if (!lyric.lrc) return null
    const index = lyric.lrc.findLastIndex(item => item.time <= time)
    return lyric.lrc[clamp(index, 0, lyric.lrc.length - 1)]?.lyric
  }, [lyric.lrc, time])

  const handlePlayOrPause = async () => {
    try {
      paused ? await controls.play() : controls.pause()
    } catch (error) {
      console.error(error)
    }
  }

  React.useImperativeHandle(ref, () => ({ controls }), [controls])

  return (
    <div className={className}>
      {audio}
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
            'mt-5 cursor-pointer',
            '**:data-[slot=slider-range]:bg-transparent **:data-[slot=slider-range]:bg-linear-to-r **:data-[slot=slider-range]:from-transparent **:data-[slot=slider-range]:to-primary'
          )}
          max={displayDuration}
          min={0}
          value={isDragging ? sliderValue : displayTime}
          onValueChange={value => {
            setIsDragging(true)
            setSliderValue(value)
          }}
          onValueCommitted={value => {
            setIsDragging(false)
            controls.seek(value / 1000)
          }}
        />
        <p className="mt-2 flex justify-between text-xs">
          <span>{TimeHelper.formatMillisecond(displayTime)}</span>
          <span>{TimeHelper.formatMillisecond(displayDuration)}</span>
        </p>
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div>
            <Toggle
              className="rounded-full border not-aria-pressed:border-transparent"
              pressed={loop}
              variant={loop ? 'outline' : 'default'}
              onPressedChange={setLoop}
            >
              <Repeat1Icon />
            </Toggle>
          </div>
          <Button
            className="size-12 rounded-full p-0"
            disabled={loading}
            variant="outline"
            onClick={() => {
              void handlePlayOrPause()
            }}
          >
            <DisplayByConditional condition={!loading} fallback={<Loader2Icon className="size-5 animate-spin" />}>
              <motion.div className="flex size-full items-center justify-center px-4 py-2" tabIndex={-1} whileTap={{ scale: 0.8 }}>
                {paused ? <PlayIcon className="size-6" /> : <PauseIcon className="size-6" />}
              </motion.div>
            </DisplayByConditional>
          </Button>
        </div>
      </div>
    </div>
  )
}
