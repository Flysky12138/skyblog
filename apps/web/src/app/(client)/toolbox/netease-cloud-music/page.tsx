'use client'

import { useImmer } from '@repo/react-hooks'
import { toast } from '@repo/ui/base'
import { Card } from '@repo/ui/components-self/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@repo/ui/components/input-group'
import { Spinner } from '@repo/ui/components/spinner'
import { isBrowser } from 'es-toolkit'
import { SearchIcon } from 'lucide-react'
import React from 'react'
import useSWRInfinite from 'swr/infinite'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { rpc, unwrap } from '@/lib/http/rpc'

import { AudioPlayerModal } from './_components/audio-player-modal'
import { DownloadModal } from './_components/download-modal'
import { SongList } from './_components/song-list'

const getSearch = () => (isBrowser() ? decodeURIComponent(new URLSearchParams(window.location.search).get('search') ?? '') : '')

export default function Page() {
  const [search, setSearch] = React.useState('')
  const [keywords, setKeywords] = React.useState('')

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(getSearch())
    setKeywords(getSearch())
  }, [])

  const {
    data = [],
    isLoading,
    setSize
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
        return rpc['netease-cloud-music'].playlist({ id }).get().then(unwrap)
      }
      // https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=%e6%90%9c%e7%b4%a2
      return rpc['netease-cloud-music'].search.get({ query: { keywords, page } }).then(unwrap)
    },
    {
      fallbackData: [{ hasMore: false, songCount: 0, songs: [] }],
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: error => {
        toast.error(error instanceof Error ? error.message : String(error))
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
  const [isOpen, setIsOpen] = React.useState(false)
  const [player, setPlayer] = useImmer<(typeof songs)[number] | null>(null)

  return (
    <>
      <InputGroup>
        <InputGroupInput
          autoComplete="off"
          disabled={isLoading}
          placeholder="搜索 / 粘贴歌单或专辑分享链接"
          value={search}
          onChange={event => {
            const text = event.target.value
            const playlistId = /playlist(?:\?id=|\/)(\d+)/.exec(text)?.[1]
            if (playlistId) {
              setSearch(`p${playlistId}`)
              toast.success('识别到歌单，已自动转换')
              return
            }
            const albumId = /album(?:\?id=|\/)(\d+)/.exec(text)?.[1]
            if (albumId) {
              setSearch(`a${albumId}`)
              toast.success('识别到专辑，已自动转换')
              return
            }
            setSearch(text)
          }}
          onKeyDown={event => {
            if (event.key != 'Enter') return
            setKeywords(search.trim())
          }}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      <DisplayByConditional
        condition={songs.length > 0}
        fallback={
          <DisplayByConditional
            condition={isLoading}
            fallback={
              <p className="py-10 text-center text-sm leading-6 text-muted-foreground">
                站长贡献 <span className="italic">VIP</span> 账号，以实现会员歌曲使用 <br />
                部分歌曲需要直接购买，若我云盘中存在时才可使用
              </p>
            }
          >
            <Card className="flex items-center justify-center rounded-md py-10">
              <Spinner className="size-8" />
            </Card>
          </DisplayByConditional>
        }
      >
        <SongList
          hasMore={hasMore}
          loadMoreRows={async () => {
            await setSize(size => size + 1)
          }}
          songs={songs}
          onRowClick={song => {
            if (player?.id != song.id) {
              setPlayer(song)
            }
            setIsOpen(true)
          }}
        />
      </DisplayByConditional>

      <DownloadModal songs={songs} />
      <AudioPlayerModal open={isOpen} song={player} onOpenChange={setIsOpen} />
    </>
  )
}
