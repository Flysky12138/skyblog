'use client'

import { CirclePause, CirclePlay } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useMemo } from 'react'
import React from 'react'
import { useMeasure } from 'react-use'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import useSWRInfinite from 'swr/infinite'
import { useImmer } from 'use-immer'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/layout/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { CustomRequest } from '@/lib/http/request'

import { AudioProps } from './_components/audio'

const Audio = dynamic(() => import('./_components/audio').then(module => module.Audio), { ssr: false })

export default function Page() {
  const [search, setSearch] = React.useState('')
  const [player, setPlayer] = useImmer<(typeof data)[number]['songs'][number] | null>(null)

  const [keywords, setKeywords] = React.useState('')

  const [paused, setPaused] = useImmer(false)
  const audioRef = React.useRef<NonNullable<AudioProps['ref']>['current']>(null)

  const [divRef, { height }] = useMeasure<HTMLDivElement>()

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
  const songs = useMemo(() => data.flatMap(item => item.songs), [data])
  const hasMore = data.at(-1)?.hasMore
  const itemCount = hasMore ? songs.length + 1 : songs.length
  const isItemLoaded = (index: number) => !hasMore || index < songs.length

  React.useEffect(() => {
    const s = decodeURIComponent(new URLSearchParams(window.location.search).get('search') || '')
    setSearch(s)
    setKeywords(s)
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
      <p className="text-muted-foreground text-end text-xs">
        {songs.length} / {data[0].songCount}
      </p>
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
        <Card asChild>
          <div ref={divRef} className="grow overflow-hidden rounded-md">
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={() => {
                if (!hasMore) return
                setSize(size + 1)
              }}
              threshold={5}
            >
              {({ ref, onItemsRendered }) => (
                <FixedSizeList
                  ref={ref}
                  className="scrollbar-hidden overscroll-y-none"
                  height={height}
                  itemCount={itemCount}
                  itemData={songs}
                  itemSize={48}
                  overscanCount={8}
                  width="100%"
                  onItemsRendered={onItemsRendered}
                >
                  {({ data, index, style }) => {
                    if (!isItemLoaded(index)) {
                      return (
                        <div className="flex items-center justify-center" style={style}>
                          <Spinner variant="bars" />
                        </div>
                      )
                    }
                    const song = data[index]
                    return (
                      <div
                        className="flex cursor-pointer items-center gap-2 border-b px-1.5 last:border-b-0"
                        style={style}
                        onClick={() => {
                          if (player?.id == song.id) {
                            if (paused) {
                              audioRef.current?.controls.play()
                            } else {
                              audioRef.current?.controls.pause()
                            }
                          } else {
                            audioRef.current?.controls.pause()
                            setPlayer(song)
                          }
                        }}
                      >
                        <Image unoptimized alt={song.al.name} height={36} src={song.al.picUrl + '?param=72y72'} width={36} />
                        <div className="truncate">
                          <p className="truncate text-sm">{song.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {song.ar[0].name} - {song.al.name}
                          </p>
                        </div>
                        {player?.id == song.id && (
                          <div className="pointer-events-none ml-auto opacity-60" onClick={event => event.stopPropagation()}>
                            {paused ? <CirclePlay /> : <CirclePause />}
                          </div>
                        )}
                      </div>
                    )
                  }}
                </FixedSizeList>
              )}
            </InfiniteLoader>
          </div>
        </Card>
      </DisplayByConditional>
      <Audio ref={audioRef} id={player?.id} onPausedChange={setPaused} />
    </div>
  )
}
