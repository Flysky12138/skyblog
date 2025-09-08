import { CirclePause, CirclePlay } from 'lucide-react'
import dynamic from 'next/dynamic'
import React from 'react'
import { useMeasure } from 'react-use'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { useImmer } from 'use-immer'

import { Card } from '@/components/layout/card'
import { Spinner } from '@/components/ui/spinner'

import { AudioProps } from './audio'

const Audio = dynamic(() => import('./audio').then(module => module.Audio), { ssr: false })

interface SongListProps {
  hasMore?: boolean
  songs: AppRouteHandlerMethodMap['GET /api/netease-cloud-music/search']['return']['songs']
  loadMoreRows: () => void
}

export const SongList = ({ hasMore, loadMoreRows, songs }: SongListProps) => {
  const [divRef, { height }] = useMeasure<HTMLDivElement>()

  const audioRef = React.useRef<NonNullable<AudioProps['ref']>['current']>(null)

  const [player, setPlayer] = useImmer<null | SongListProps['songs'][number]>(null)
  const [paused, setPaused] = useImmer(false)

  const itemCount = hasMore ? songs.length + 1 : songs.length
  const isItemLoaded = (index: number) => !hasMore || index < songs.length

  return (
    <Card asChild>
      <div ref={divRef} className="grow overflow-hidden rounded-md">
        <Audio ref={audioRef} id={player?.id} onPausedChange={setPaused} />
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={() => {
            if (!hasMore) return
            loadMoreRows()
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
                    <img alt={song.al.name} decoding="async" height={36} loading="lazy" src={song.al.picUrl + '?param=72y72'} width={36} />
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
  )
}
