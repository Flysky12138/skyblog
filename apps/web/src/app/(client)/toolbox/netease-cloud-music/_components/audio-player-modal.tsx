'use client'

import { useControllableState } from '@repo/react-hooks'
import { toast } from '@repo/ui/base'
import {
  DialogDrawer,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerHeader,
  DialogDrawerTitle
} from '@repo/ui/components-self/dialog-drawer'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

import { AudioPlayer, AudioPlayerProps } from '@/app/toolbox/netease-cloud-music/player/_components/audio-player'
import { getLyric, getSongUrl } from '@/app/toolbox/netease-cloud-music/player/utils'

export interface AudioPlayerModalProps {
  open?: boolean
  song?: AudioPlayerProps['song'] | null
  onOpenChange?: (open: boolean) => void
}

export function AudioPlayerModal({ open: controlledOpen, song, onOpenChange }: AudioPlayerModalProps) {
  const router = useRouter()

  const [open, setOpen] = useControllableState({ defaultValue: false, value: controlledOpen, onChange: onOpenChange })

  const id = song?.id ?? 0

  // 获取音频地址
  const { data: url, isLoading } = useSWR(
    id ? ['019e73c9-7b8c-75fd-9b87-f548ea29be37', id] : null,
    async () => {
      const url = await getSongUrl(id)
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
  const { data: lyric } = useSWR(id ? ['019e73c9-89e8-7702-b94a-412d41eb70ff', id] : null, () => getLyric(id), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData: {
      lrc: [],
      lrcText: null
    }
  })

  if (!song) return null

  return (
    <DialogDrawer
      dialogRouting={false}
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen)
        if (!isOpen) {
          router.back()
        }
      }}
    >
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
        <AudioPlayer autoPlay loading={isLoading} lyric={lyric} song={song} url={url} />
      </DialogDrawerContent>
    </DialogDrawer>
  )
}
