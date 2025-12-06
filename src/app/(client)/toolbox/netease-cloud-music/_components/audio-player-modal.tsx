'use client'

import { clamp } from 'es-toolkit'
import { AnimatePresence, motion } from 'framer-motion'
import { AudioLines, Loader2Icon, Pause, Play, Repeat1 } from 'lucide-react'
import React from 'react'
import { useAudio } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'

import { AlbumResponseType } from '@/app/api/[[...elysia]]/client/netease-cloud-music/model'
import {
  DialogDrawer,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerHeader,
  DialogDrawerTitle,
  DialogDrawerTrigger
} from '@/components/dialog-drawer'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { Portal } from '@/components/utils/portal'
import { ATTRIBUTE } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { formatMillisecond } from '@/lib/parser/time'
import { cn } from '@/lib/utils'
import { useLive2DContext } from '@/providers/live2d'

export interface AudioPlayerModalProps {
  ref?: React.RefObject<AudioPlayerModalRef | null>
  song?: AlbumResponseType['songs'][number] | null
}

export interface AudioPlayerModalRef {
  controls: ReturnType<typeof useAudio>[2]
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AudioPlayerModal({ ref, song }: AudioPlayerModalProps) {
  const [open, setOpen] = React.useState(false)

  const [isMoving, setIsMoving] = React.useState(false)
  const [sliderValue, setSliderValue] = React.useState(0)
  const [loop, setLoop] = React.useState(false)

  // 获取音频地址
  const {
    data: src,
    isLoading,
    mutate: mutateSrc
  } = useSWR(
    song?.id ? ['0198f641-f60c-720d-98c2-69a4f880a373', 'standard', song.id] : null,
    async () => {
      const [{ url }] = await rpc['netease-cloud-music']
        .song({ id: song?.id ?? -1 })
        .url.get({ query: { level: 'standard' } })
        .then(unwrap)
      if (url) return url
      toast.error('获取音频失败')
      return ''
    },
    {
      fallbackData: '',
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  // 获取歌词
  const { data: lyrics } = useSWR(
    song?.id ? ['01999f06-e557-7399-add7-0dc78c051556', song.id] : null,
    () =>
      rpc['netease-cloud-music']
        .lyric({ id: song?.id ?? -1 })
        .get()
        .then(unwrap),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      fallbackData: {
        lrc: []
      }
    }
  )

  const [audio, { duration, paused, time }, controls] = useAudio({
    autoPlay: true,
    loop,
    src: src.replace('http:', 'https:'),
    onCanPlay: () => {
      setIsMoving(false)
    }
  })

  const displayTime = Number.isFinite(time) ? time * 1000 : 0
  const displayDuration = Number.isFinite(duration) ? duration * 1000 : 0

  // 当前进度的歌词
  const lyric = React.useMemo(() => {
    if (!lyrics.lrc) return null
    const index = lyrics.lrc.findLastIndex(item => item.time <= time)
    return lyrics.lrc[clamp(index, 0, lyrics.lrc.length - 1)]?.lyric
  }, [lyrics.lrc, time])

  // Live2D 显示歌词
  const { setMessage } = useLive2DContext()
  React.useEffect(() => {
    if (!lyric) return
    setMessage({ content: lyric, priority: 10, timeout: 60_000 })
  }, [lyric, setMessage])

  // 切换歌曲进度归零且暂停
  React.useEffect(() => {
    controls.pause()
    controls.seek(0)
    mutateSrc('', { revalidate: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song?.id])

  React.useImperativeHandle(ref, () => ({ controls, setOpen }), [controls, setOpen])

  if (!song) return null

  return (
    <>
      <Portal>{audio}</Portal>
      <DialogDrawer open={open} onOpenChange={setOpen}>
        <Portal selector={`#${ATTRIBUTE.ID.NAV_CONTAINER}`}>
          <DialogDrawerTrigger asChild>
            <Button size="icon">
              <AudioLines />
            </Button>
          </DialogDrawerTrigger>
        </Portal>
        <DialogDrawerContent
          className="overflow-hidden"
          dialogClassName="max-w-sm p-0! gap-0 border-none"
          drawerClassName="*:first:hidden"
          showCloseButton={false}
        >
          <DialogDrawerHeader className="sr-only">
            <DialogDrawerTitle>歌曲播放面板</DialogDrawerTitle>
            <DialogDrawerDescription>
              正在播放歌曲: {song.name}, 歌手: {song.ar[0].name}
            </DialogDrawerDescription>
          </DialogDrawerHeader>
          <div className="relative">
            <img alt={song.name} className="w-full" height={720} src={song.al.picUrl.replace('http:', 'https:') + '?param=720y720'} width={720} />
            <AnimatePresence initial={false} mode="wait">
              <motion.p
                key={lyric}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 w-full p-2 text-center break-all"
                exit={{ opacity: 0, y: 10 }}
                initial={{ opacity: 0, y: 10 }}
              >
                {lyric}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="bg-card p-6">
            <p className="space-x-2">
              <span className="truncate text-xl leading-0">{song.name}</span>
              <span className="shrink-0 text-sm leading-0">{song.ar[0].name}</span>
            </p>
            <Slider
              className={cn(
                'mt-5 cursor-pointer',
                '**:data-[slot=slider-range]:to-primary **:data-[slot=slider-range]:bg-transparent **:data-[slot=slider-range]:bg-linear-to-r **:data-[slot=slider-range]:from-transparent'
              )}
              max={displayDuration}
              min={0}
              value={isMoving ? [sliderValue] : [displayTime]}
              onValueChange={value => {
                setIsMoving(true)
                setSliderValue(value[0])
              }}
              onValueCommit={value => {
                controls.seek(value[0] / 1000)
              }}
            />
            <p className="mt-2 flex justify-between text-xs">
              <span>{formatMillisecond(displayTime)}</span>
              <span>{formatMillisecond(displayDuration)}</span>
            </p>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div>
                <Toggle className="rounded-full" pressed={loop} variant={loop ? 'outline' : 'default'} onPressedChange={setLoop}>
                  <Repeat1 />
                </Toggle>
              </div>
              <Button
                className="size-12 rounded-full p-0"
                disabled={isLoading}
                variant="outline"
                onClick={() => {
                  controls[paused ? 'play' : 'pause']()
                }}
              >
                <DisplayByConditional condition={!isLoading} fallback={<Loader2Icon className="size-5 animate-spin" />}>
                  <motion.div className="flex size-full items-center justify-center px-4 py-2" tabIndex={-1} whileTap={{ scale: 0.8 }}>
                    {paused ? <Play className="size-6" /> : <Pause className="size-6" />}
                  </motion.div>
                </DisplayByConditional>
              </Button>
            </div>
          </div>
        </DialogDrawerContent>
      </DialogDrawer>
    </>
  )
}
