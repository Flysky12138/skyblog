'use client'

import { Card } from '@repo/components/card'
import { toast } from '@repo/ui/base'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@repo/ui/components/input-group'
import { Spinner } from '@repo/ui/components/spinner'
import { pick } from 'es-toolkit'
import { SearchIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import useSWRInfinite from 'swr/infinite'
import { useShallow } from 'zustand/shallow'

import { Show } from '@/components/show'
import { rpc, unwrap } from '@/lib/http/rpc'
import { useMusicStore } from '@/store/music'

import { DownloadDrawer } from './_components/download-drawer'
import { SongList } from './_components/song-list'

export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const keywords = searchParams.get('search') ?? ''

  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.value = keywords
  }, [keywords])

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
        const id = keywords.trim().slice(1)
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
      }
    }
  )
  const songs = React.useMemo(() => data.flatMap(item => item.songs), [data])
  const hasMore = data.at(-1)?.hasMore

  // 保存歌曲列表，用于播放器播放（跨路由）
  const { setPlaylist } = useMusicStore(useShallow(state => pick(state, ['setPlaylist'])))
  React.useEffect(() => {
    if (songs.length === 0) return
    setPlaylist(songs)
  }, [setPlaylist, songs])

  return (
    <>
      <DownloadDrawer key={keywords} songs={songs} />

      <InputGroup>
        <InputGroupInput
          ref={inputRef}
          autoComplete="off"
          disabled={isLoading}
          placeholder="搜索 / 粘贴歌单或专辑分享链接"
          onChange={event => {
            const text = event.currentTarget.value

            const playlistId = /playlist(?:\?id=|\/)(\d+)/.exec(text)?.[1]
            if (playlistId) {
              event.currentTarget.value = `p${playlistId}`
              toast.success('识别到歌单，已自动转换')
              return
            }

            const albumId = /album(?:\?id=|\/)(\d+)/.exec(text)?.[1]
            if (albumId) {
              event.currentTarget.value = `a${albumId}`
              toast.success('识别到专辑，已自动转换')
              return
            }
          }}
          onKeyDown={event => {
            if (event.key !== 'Enter') return
            router.push(`${pathname}?search=${encodeURIComponent(event.currentTarget.value.trim())}`)
          }}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      <Show
        fallback={
          <Show
            fallback={
              <p className="py-10 text-center text-sm leading-6 text-muted-foreground">
                站长贡献 <span className="italic">VIP</span> 账号，以实现会员歌曲使用 <br />
                部分歌曲需要直接购买，若我云盘中存在时才可使用
              </p>
            }
            when={isLoading}
          >
            <Card className="flex h-32 items-center justify-center rounded-md ring-0">
              <Spinner className="size-8" />
            </Card>
          </Show>
        }
        when={songs.length > 0}
      >
        <SongList
          hasMore={hasMore}
          loadMoreRows={async () => {
            await setSize(size => size + 1)
          }}
          songs={songs}
        />
      </Show>
    </>
  )
}
