'use client'

import React from 'react'
import useSWRInfinite from 'swr/infinite'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/layout/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { CustomRequest } from '@/lib/http/request'

import { DownloadList } from './_components/download-list'
import { SongList } from './_components/song-list'

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
    ([page]) => CustomRequest('GET /api/netease-cloud-music/search', { search: { keywords, page } }),
    {
      fallbackData: [{ hasMore: false, songCount: 0, songs: [] }],
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  const songs = React.useMemo(() => data.flatMap(item => item.songs), [data])
  const hasMore = data.at(-1)?.hasMore

  React.useEffect(() => {
    const _search = decodeURIComponent(new URLSearchParams(window.location.search).get('search') || '')
    setSearch(_search)
    setKeywords(_search)
  }, [])

  return (
    <div className="mx-auto flex h-[calc(var(--height-main)-2*var(--py))] max-w-xl flex-col gap-4">
      <Input
        placeholder="搜索"
        value={search}
        onChange={event => {
          setSearch(event.target.value)
          const url = new URL(window.location.href)
          url.searchParams.set('search', encodeURIComponent(event.target.value))
          window.history.replaceState({}, '', url.toString())
        }}
        onKeyDown={event => {
          if (event.key == 'Enter') {
            setKeywords(search)
          }
        }}
      />
      <DisplayByConditional
        condition={songs.length > 0}
        fallback={
          <DisplayByConditional
            condition={isLoading}
            fallback={
              <p className="text-muted-foreground py-10 text-center text-sm leading-6">
                站长贡献 <span className="italic">VIP</span> 账号，以实现会员歌曲使用 <br />
                部分歌曲是需要直接购买才可使用的，若我云盘中存在时可使用
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
          songs={songs}
        />
      </DisplayByConditional>
      <DownloadList songs={songs} />
    </div>
  )
}
