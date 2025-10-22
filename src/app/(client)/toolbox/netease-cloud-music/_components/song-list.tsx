'use client'

import { useMeasure } from 'react-use'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

import { Card } from '@/components/static/card'
import { Spinner } from '@/components/ui/spinner'

interface SongListProps {
  hasMore?: boolean
  songs: AppRouteHandlerMethodMap['GET /api/netease-cloud-music/search']['return']['songs']
  loadMoreRows: () => void
  onRowClick?: (song: SongListProps['songs'][number]) => void
}

export const SongList = ({ hasMore, loadMoreRows, songs, onRowClick }: SongListProps) => {
  const [divRef, { height }] = useMeasure<HTMLDivElement>()

  const itemCount = hasMore ? songs.length + 1 : songs.length
  const isItemLoaded = (index: number) => !hasMore || index < songs.length

  return (
    <Card asChild>
      <div ref={divRef} className="grow overflow-hidden rounded-md">
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
                      <Spinner />
                    </div>
                  )
                }
                const song = data[index]
                return (
                  <div
                    className="relative flex cursor-pointer items-center gap-2 border-b px-1.5 last:border-b-0"
                    style={style}
                    onClick={() => {
                      onRowClick?.(song)
                    }}
                  >
                    <img
                      alt={song.al.name}
                      decoding="async"
                      height={36}
                      loading="lazy"
                      src={song.al.picUrl.replace('http:', 'https:') + '?param=72y72'}
                      width={36}
                    />
                    <div className="truncate">
                      <p className="truncate text-sm">{song.name}</p>
                      <p className="text-muted-foreground text-xs">{[song.ar[0].name, song.al.name].filter(Boolean).join(' - ')}</p>
                    </div>
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
