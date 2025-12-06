'use client'

import dayjs from 'dayjs'
import { limitAsync } from 'es-toolkit'
import { Download } from 'lucide-react'
import React from 'react'
import { useAsyncFn, useBeforeUnload, useMap, useSet } from 'react-use'
import { List, RowComponentProps } from 'react-window'
import { toast } from 'sonner'

import { AlbumResponseType, SongUrlQueryType } from '@/app/api/[[...elysia]]/client/netease-cloud-music/model'
import {
  DialogDrawer,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerHeader,
  DialogDrawerTitle,
  DialogDrawerTrigger
} from '@/components/dialog-drawer'
import { Button } from '@/components/ui-overwrite/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Portal } from '@/components/utils/portal'
import { ATTRIBUTE } from '@/lib/constants'
import { AudioFFmpeg } from '@/lib/ffmpeg/audio'
import { DirectoryHelper } from '@/lib/file/directory-helper'
import { ProgressProps, readResponseProgress } from '@/lib/http/progress'
import { rpc, unwrap } from '@/lib/http/rpc'
import { cn } from '@/lib/utils'

type LevelType = NonNullable<SongUrlQueryType['level']>

const LEVEL_OPTIONS: { label: string; value: LevelType }[] = [
  { label: '超清母带 20M~180M', value: 'jymaster' },
  { label: '沉浸环绕声 20M~80M', value: 'sky' },
  { label: '高清臻音 20M~100M', value: 'jyeffect' },
  { label: '高解析度无损 30M', value: 'hires' },
  { label: '无损 10~30M', value: 'lossless' },
  { label: '极高 5~10M', value: 'exhigh' },
  // { label: '较高', value: 'higher' },
  { label: '标准 2~5M', value: 'standard' }
]
const REMOVE_ARTIST_NAMES = ['杰伦', '杰倫', '蔡健雅', '曲婉婷']

interface DownloadModalProps {
  songs: AlbumResponseType['songs']
}

interface RowProps {
  hasMore?: boolean
  isDownloading: boolean
  songs: DownloadModalProps['songs']
  getProgress: (id: number) => ProgressProps | undefined
  isSelected: (song: RowProps['songs'][number]) => boolean
  onRowClick?: (song: RowProps['songs'][number]) => void
}

export function DownloadModal({ songs }: DownloadModalProps) {
  songs = songs.filter(song => !song.ar.some(ar => REMOVE_ARTIST_NAMES.some(name => ar.name.includes(name))))

  const [level, setLevel] = React.useState<LevelType>('hires')
  const [selected, { add: addSelected, clear: clearSelected, has: hasSelected, toggle: toggleSelected }] =
    useSet<DownloadModalProps['songs'][number]>()
  const [progress, { get: getProgress, remove: removeProgress, set: setProgress }] = useMap<Record<number, ProgressProps | undefined>>()

  const [{ loading: isDownloading }, handleDownload] = useAsyncFn(async () => {
    const helper = new DirectoryHelper()
    await helper.openDirectory({ mode: 'readwrite', startIn: 'music' })

    const ffmpeg = new AudioFFmpeg()
    await ffmpeg.init()

    const download = async (song: DownloadModalProps['songs'][number]) => {
      try {
        const [{ md5, type, url }] = await rpc['netease-cloud-music'].song({ id: song.id }).url.get({ query: { level } }).then(unwrap)

        if (!url) {
          throw new Error([song.ar[0].name, song.al.name].filter(Boolean).join(' - '))
        }

        const audioBlob = await fetch(url.replace('http:', 'https:')).then(async res => {
          if (!res.ok) throw new Error('Failed to fetch song')
          return readResponseProgress(res, payload => setProgress(song.id, payload))
        })
        const coverBlob = await fetch(song.al.picUrl.replace('http:', 'https:') + '?param=1200y1200').then(res => {
          if (!res.ok) throw new Error('Failed to fetch cover')
          return res.blob()
        })

        const audio = await ffmpeg.updateAudioMetadata({
          audio: { content: audioBlob, ext: type },
          cover: { content: coverBlob, ext: 'jpg' },
          metadata: {
            album: song.al.name,
            albumArtist: song.ar[0].name,
            artist: song.ar.map(ar => ar.name).join(', '),
            title: song.name,
            year: song.publishTime ? dayjs(song.publishTime).year() : undefined
          }
        })

        await helper.writeFile(`${song?.name || md5}.${type}`, audio)

        toggleSelected(song)
        removeProgress(song.id)
      } catch (error) {
        toast.error(`《${song.name}》下载失败`, {
          description: error instanceof Error ? error.message : (error as string),
          richColors: true
        })
      }
    }

    const limit = limitAsync(download, 5)

    await Promise.allSettled(Array.from(selected, limit))
  }, [selected, level])

  useBeforeUnload(isDownloading, '正在下载中，不要关闭窗口')

  if (!songs.length) return null

  return (
    <DialogDrawer>
      <Portal selector={`#${ATTRIBUTE.ID.NAV_CONTAINER}`}>
        <DialogDrawerTrigger asChild>
          <Button size="icon">
            <Download />
          </Button>
        </DialogDrawerTrigger>
      </Portal>
      <DialogDrawerContent dialogClassName="max-w-xl p-0! gap-0" drawerClassName="border" showCloseButton={false}>
        <DialogDrawerHeader className="sr-only">
          <DialogDrawerTitle>歌曲下载面板</DialogDrawerTitle>
          <DialogDrawerDescription>下载所选歌曲到本地磁盘</DialogDrawerDescription>
        </DialogDrawerHeader>

        <div className="border-divide flex items-center gap-2 border-b px-2.5 pt-3 pb-3 shadow-xs md:mt-0">
          <Checkbox
            checked={selected.size == songs.length ? true : selected.size == 0 ? false : 'indeterminate'}
            disabled={isDownloading}
            onClick={() => {
              if (selected.size == songs.length) {
                clearSelected()
              } else {
                songs.forEach(addSelected)
              }
            }}
          />
          <Select
            defaultValue={level}
            disabled={isDownloading}
            onValueChange={value => {
              setLevel(value as LevelType)
            }}
          >
            <SelectTrigger className="ml-auto" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVEL_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="select-none" disabled={isDownloading || selected.size == 0} loading={isDownloading} size="sm" onClick={handleDownload}>
            下载（{selected.size}）
          </Button>
        </div>

        <List
          className="no-scrollbar"
          overscanCount={8}
          rowComponent={Row}
          rowCount={isDownloading ? selected.size : songs.length}
          rowHeight={48}
          rowProps={
            {
              getProgress,
              isDownloading,
              isSelected: hasSelected,
              songs: isDownloading ? Array.from(selected) : songs,
              onRowClick: toggleSelected
            } satisfies RowProps
          }
          style={{ height: 48 * 10 }}
        />
      </DialogDrawerContent>
    </DialogDrawer>
  )
}

function Row({ ariaAttributes, getProgress, index, isDownloading, isSelected, songs, style, onRowClick }: RowComponentProps & RowProps) {
  const song = songs[index]
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-2 border-b px-1.5 last:border-b-0',
        'bg-linear-to-r bg-clip-padding bg-no-repeat',
        'from-indigo-200 via-purple-200 to-pink-200',
        'dark:from-indigo-800/30 dark:via-purple-800/30 dark:to-pink-800/30'
      )}
      style={{ backgroundSize: `${getProgress(song.id)?.progress || 0}%`, ...style }}
      {...ariaAttributes}
      onClick={() => {
        if (isDownloading) return
        onRowClick?.(song)
      }}
    >
      {!isDownloading && <Checkbox checked={isSelected(song)} className="mx-1" />}
      <img
        alt={song.al.name}
        crossOrigin="anonymous"
        decoding="async"
        height={36}
        loading="lazy"
        src={song.al.picUrl.replace('http:', 'https:') + '?param=72y72'}
        width={36}
      />
      <div className="truncate">
        <p className="truncate text-sm">{song.name}</p>
        <p className="text-muted-foreground text-xs">{[song.ar.map(item => item.name).join('/'), song.al.name].filter(Boolean).join(' - ')}</p>
      </div>
    </div>
  )
}
