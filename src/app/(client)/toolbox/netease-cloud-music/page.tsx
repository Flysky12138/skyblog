'use client'

import { CirclePause, CirclePlay } from 'lucide-react'
import dynamic from 'next/dynamic'
import React from 'react'
import { toast } from 'sonner'
import useSWRInfinite from 'swr/infinite'
import { useImmer } from 'use-immer'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { CustomRequest } from '@/lib/http/request'

import { AudioProps } from './_components/audio'
import { DownloadList } from './_components/download-list'
import { SongList } from './_components/song-list'

const Audio = dynamic(() => import('./_components/audio').then(module => module.Audio), { ssr: false })

export default function Page() {
  const [search, setSearch] = React.useState('')
  const [keywords, setKeywords] = React.useState('')

  const {
    data = [],
    isLoading,
    setSize,
    size
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (!keywords) return null
      if (previousPageData && !previousPageData?.hasMore) return null
      return [pageIndex, keywords, '0198f59d-bdf5-72dd-a3e1-1cba5681d3b7']
    },
    async ([page, keywords]) => {
      // 歌单
      if (/^p\d+$/.test(keywords.trim())) {
        const id = keywords.trim().replace('p', '')
        return CustomRequest('GET /api/netease-cloud-music/playlist/detail', { search: { id } })
      }
      // 专辑
      if (/^a\d+$/.test(keywords.trim())) {
        const id = keywords.trim().replace('a', '')
        return CustomRequest('GET /api/netease-cloud-music/album', { search: { id } })
      }
      // https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=%e6%90%9c%e7%b4%a2
      return CustomRequest('GET /api/netease-cloud-music/search', { search: { keywords, page } })
    },
    {
      fallbackData: [{ hasMore: false, songCount: 0, songs: [] }],
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: err => {
        toast.error(err)
      },
      onSuccess: () => {
        const url = new URL(window.location.href)
        url.searchParams.set('search', encodeURIComponent(search))
        window.history.replaceState({}, '', url.toString())
      }
    }
  )
  const songs = React.useMemo(() => data.flatMap(item => item.songs), [data])
  const hasMore = data.at(-1)?.hasMore

  // 播放器
  const audioRef = React.useRef<NonNullable<AudioProps['ref']>['current']>(null)
  const [player, setPlayer] = useImmer<(typeof data)[number]['songs'][number] | null>(null)
  const [paused, setPaused] = useImmer(false)

  React.useEffect(() => {
    const _search = decodeURIComponent(new URLSearchParams(window.location.search).get('search') || '')
    setSearch(_search)
    setKeywords(_search)
  }, [])

  return (
    <div className="mx-auto flex h-[calc(var(--height-main)-2*var(--py))] max-w-xl flex-col gap-4">
      <Input
        placeholder="搜索 / 粘贴歌单或专辑分享链接"
        value={search}
        onChange={event => {
          setSearch(event.target.value)
        }}
        onKeyDown={event => {
          if (event.key != 'Enter') return
          setKeywords(search.trim())
        }}
        onPaste={async event => {
          const text = await event.clipboardData.getData('text')
          const playlistId = text.match(/playlist\?id=(\d+)/)?.[1]
          if (playlistId) {
            event.preventDefault()
            setSearch(`p${playlistId}`)
            toast.success('已自动将歌单 ID 填入搜索框')
            return
          }
          const albumId = text.match(/album\?id=(\d+)/)?.[1]
          if (albumId) {
            event.preventDefault()
            setSearch(`a${albumId}`)
            toast.success('已自动将专辑 ID 填入搜索框')
          }
        }}
      />
      <DisplayByConditional
        condition={songs.length > 0 && !!search}
        fallback={
          <DisplayByConditional
            condition={isLoading}
            fallback={
              <p className="text-muted-foreground py-10 text-center text-sm leading-6">
                站长贡献 <span className="italic">VIP</span> 账号，以实现会员歌曲使用 <br />
                部分歌曲需要直接购买，若我云盘中存在时才可使用
              </p>
            }
          >
            <Card className="flex items-center justify-center rounded-md py-10">
              <Spinner variant="bars" />
            </Card>
          </DisplayByConditional>
        }
      >
        <SongList
          hasMore={hasMore}
          loadMoreRows={() => {
            setSize(size + 1)
          }}
          playerIcon={song => {
            if (player?.id != song.id) return null
            return (
              <div className="pointer-events-none ml-auto opacity-60" onClick={event => event.stopPropagation()}>
                {paused ? <CirclePlay /> : <CirclePause />}
              </div>
            )
          }}
          songs={songs}
          onRowClick={song => {
            if (player?.id == song.id) {
              audioRef.current?.controls[paused ? 'play' : 'pause']()
            } else {
              audioRef.current?.controls.pause()
              setPlayer(song)
            }
          }}
        />
      </DisplayByConditional>
      <DownloadList songs={songs} />
      <Audio ref={audioRef} id={player?.id} onPausedChange={setPaused} />
    </div>
  )
}
