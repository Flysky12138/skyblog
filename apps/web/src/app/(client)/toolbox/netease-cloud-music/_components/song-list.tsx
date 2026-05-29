'use client'

import { Card } from '@repo/ui/components-self/card'
import { Spinner } from '@repo/ui/components/spinner'
import { cn } from '@repo/ui/lib/utils'
import Link from 'next/link'
import React from 'react'
import { List, RowComponentProps } from 'react-window'
import { useInfiniteLoader } from 'react-window-infinite-loader'

import { AlbumResponseType } from '@/app/api/[[...elysia]]/client/netease-cloud-music/model'

interface RowProps {
  hasMore?: boolean
  songs: AlbumResponseType['songs']
  onRowClick?: (song: RowProps['songs'][number]) => void
}

interface SongListProps extends RowProps {
  loadMoreRows: () => Promise<void>
}

export function SongList({ hasMore, loadMoreRows, songs, onRowClick }: SongListProps) {
  const rowCount = hasMore ? songs.length + 1 : songs.length

  const isLoadingMoreRef = React.useRef(false)

  const onRowsRendered = useInfiniteLoader({
    rowCount,
    isRowLoaded: index => !hasMore || index < songs.length,
    loadMoreRows: async () => {
      if (!hasMore) return
      if (isLoadingMoreRef.current) return
      isLoadingMoreRef.current = true
      await loadMoreRows()
      isLoadingMoreRef.current = false
    }
  })

  return (
    <Card
      className="rounded-md"
      render={
        <List
          className="no-scrollbar overscroll-none"
          overscanCount={8}
          rowComponent={Row}
          rowCount={rowCount}
          rowHeight={48}
          rowProps={{ hasMore, songs, onRowClick }}
          onRowsRendered={onRowsRendered}
        />
      }
    />
  )
}

function Row({ ariaAttributes, hasMore, index, songs, style, onRowClick }: RowComponentProps & RowProps) {
  if (hasMore && index >= songs.length) {
    return (
      <div className="flex items-center justify-center" style={style} {...ariaAttributes}>
        <Spinner />
      </div>
    )
  }

  const song = songs[index]

  return (
    <Link
      className={cn('relative flex cursor-pointer items-center gap-2 px-1.5', {
        'border-t': index > 0
      })}
      href={{
        pathname: '/toolbox/netease-cloud-music/player',
        query: {
          id: song.id
        }
      }}
      scroll={false}
      style={style}
      {...ariaAttributes}
      onClick={() => {
        onRowClick?.(song)
      }}
    >
      <img
        alt={song.al.name}
        crossOrigin="anonymous"
        decoding="async"
        height={36}
        loading="lazy"
        src={song.al.picUrl.replace('http:', 'https:') + '?param=72y72'}
        width={36}
      />
      <div className="overflow-hidden">
        <p className="truncate text-sm">{song.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {[song.ar.map(item => item.name).join('/'), song.al.name].filter(Boolean).join(' - ')}
        </p>
      </div>
    </Link>
  )
}
