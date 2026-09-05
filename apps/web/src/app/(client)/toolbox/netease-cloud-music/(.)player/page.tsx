'use client'

import { toast } from '@repo/ui/base'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/ui/components/dialog'
import { pick } from 'es-toolkit'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { browser } from 'react-dom'
import { useEffectOnce } from 'react-use'
import useSWR from 'swr'
import z from 'zod'
import { useShallow } from 'zustand/shallow'

import { getLyric, getSongUrl } from '@/app/toolbox/netease-cloud-music/player/utils'
import { AudioPlayer } from '@/components/audio-player'
import { useMusicStore } from '@/store/music'

export default function Page() {
  React.use(browser())

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const id = z.string().min(4).transform(Number).refine(Number.isFinite).catch(3346495279).parse(searchParams.get('id'))

  const { next, prev, setCurrentSong, song } = useMusicStore(
    useShallow(state => ({
      song: state.playlist[state.playOrder[state.currentIndex]],
      ...pick(state, ['next', 'prev', 'setCurrentSong'])
    }))
  )

  useEffectOnce(() => {
    if (!id) return

    setCurrentSong(id)
  })

  React.useEffect(() => {
    if (!song) return
    if (song.id === id) return

    router.replace(`${pathname}?id=${song.id}`)
  }, [id, pathname, router, song])

  // 获取音频地址
  const { data: url, isLoading } = useSWR(
    id ? ['019e73c9-7b8c-75fd-9b87-f548ea29be37', id] : null,
    async () => {
      try {
        const url = await getSongUrl(id)
        if (!url) {
          throw new Error()
        }
        return url
      } catch (error) {
        toast.error('获取音频失败')
      }
      return ''
    },
    {
      fallbackData: '',
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  // 获取歌词
  const {
    data: { lyric }
  } = useSWR(id ? ['019e73c9-89e8-7702-b94a-412d41eb70ff', id] : null, () => getLyric(id), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData: {
      content: null,
      lyric: []
    }
  })

  return (
    <Dialog
      open
      onOpenChange={newOpen => {
        if (newOpen) return
        router.back()
      }}
    >
      <DialogContent className="max-w-lg overflow-hidden p-0" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>歌曲播放面板</DialogTitle>
          <DialogDescription>
            正在播放歌曲: {song.name}, 歌手: {song.ar[0].name}
          </DialogDescription>
        </DialogHeader>

        <AudioPlayer autoplay loading={isLoading} lyric={lyric} song={song} src={url} onNext={next} onPrev={prev} />
      </DialogContent>
    </Dialog>
  )
}
