'use client'

import dayjs from 'dayjs'
import { limitAsync } from 'es-toolkit'
import { DownloadIcon, MusicIcon, ScrollTextIcon } from 'lucide-react'
import React from 'react'
import { useAsyncFn, useBeforeUnload, useMap, useSet } from 'react-use'
import { List, RowComponentProps } from 'react-window'
import { toast } from 'sonner'

import { AlbumResponseType } from '@/app/api/[[...elysia]]/client/netease-cloud-music/model'
import {
  DialogDrawer,
  DialogDrawerClose,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerFooter,
  DialogDrawerHeader,
  DialogDrawerTitle,
  DialogDrawerTrigger
} from '@/components/dialog-drawer'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Portal } from '@/components/portal'
import { Button } from '@/components/ui-overwrite/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldGroup, FieldLabel, FieldTitle } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ATTRIBUTE } from '@/lib/constants'
import { AudioFFmpeg } from '@/lib/ffmpeg/audio'
import { DirectoryHelper } from '@/lib/helper/directory'
import { ProgressProps, readResponseProgress } from '@/lib/http/progress'
import { rpc, unwrap } from '@/lib/http/rpc'
import { cn } from '@/lib/utils'

import { LEVEL_OPTIONS, LevelType, REMOVE_ARTIST_BY_NAMES } from './utils'

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
  songs = songs.filter(song => !song.ar.some(ar => REMOVE_ARTIST_BY_NAMES.some(name => ar.name.includes(name))))

  const [level, setLevel] = React.useState<LevelType>('hires')
  const [selected, { add: addSelected, clear: clearSelected, has: hasSelected, toggle: toggleSelected }] =
    useSet<DownloadModalProps['songs'][number]>()
  const [progress, { get: getProgress, remove: removeProgress, set: setProgress }] = useMap<Record<number, ProgressProps | undefined>>()
  const [downloadType, { has: hasDownloadType, toggle: toggleDownloadType }] = useSet<'lyric' | 'song'>(new Set(['lyric', 'song']))

  const ffmpegRef = React.useRef<AudioFFmpeg>(null)

  const [{ loading: isDownloading }, handleDownload] = useAsyncFn(async () => {
    const helper = new DirectoryHelper()
    await helper.openDirectory({ mode: 'readwrite', startIn: 'music' })

    if (hasDownloadType('song') && !ffmpegRef.current) {
      const ffmpeg = new AudioFFmpeg()
      await ffmpeg.init()
      ffmpegRef.current = ffmpeg
    }

    const downloadSong = async (song: DownloadModalProps['songs'][number]) => {
      if (!ffmpegRef.current) return
      const [{ type, url }] = await rpc['netease-cloud-music'].song({ id: song.id }).url.get({ query: { level } }).then(unwrap)
      if (!url) {
        throw new Error([song.ar[0].name, song.al.name].filter(Boolean).join(' - '))
      }
      // 获取音频和封面
      const [audioBlob, coverBlob] = await Promise.all([
        fetch(url.replace('http:', 'https:')).then(async res => {
          if (!res.ok) throw new Error('Failed to fetch song')
          return readResponseProgress(res, payload => setProgress(song.id, payload))
        }),
        fetch(song.al.picUrl.replace('http:', 'https:') + '?param=1200y1200').then(res => {
          if (!res.ok) throw new Error('Failed to fetch cover')
          return res.blob()
        })
      ])
      // 合成文件
      const audio = await ffmpegRef.current.updateAudioMetadata({
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
      await helper.writeFile(`${song?.name ?? song.id}.${type}`, audio)
    }

    const downloadLyric = async (song: DownloadModalProps['songs'][number]) => {
      const { lrcText } = await rpc['netease-cloud-music'].lyric({ id: song.id }).get().then(unwrap)
      if (lrcText) {
        await helper.writeFile(`${song?.name ?? song.id}.lrc`, lrcText)
      } else {
        toast.error(`《${song.name}》没有歌词`)
      }
    }

    const download = async (song: DownloadModalProps['songs'][number]) => {
      try {
        await Promise.all([hasDownloadType('song') && downloadSong(song), hasDownloadType('lyric') && downloadLyric(song)])
        toggleSelected(song)
        removeProgress(song.id)
      } catch (error) {
        toast.error(`《${song.name}》下载失败`, {
          description: (error as Error).message,
          richColors: true
        })
      }
    }
    const limit = limitAsync(download, 5)
    await Promise.allSettled(Array.from(selected, limit))
  }, [selected, level, hasDownloadType])

  useBeforeUnload(isDownloading, '正在下载中，不要关闭窗口')

  if (!songs.length) return null

  return (
    <DialogDrawer>
      <Portal selector={`#${ATTRIBUTE.ID.NAV_CONTAINER_DOWNLOAD}`}>
        <DialogDrawerTrigger asChild>
          <Button size="icon">
            <DownloadIcon />
          </Button>
        </DialogDrawerTrigger>
      </Portal>
      <DialogDrawerContent dialogClassName="max-w-xl p-0! gap-0 overflow-hidden" showCloseButton={false}>
        <DialogDrawerHeader className="sr-only">
          <DialogDrawerTitle>歌曲下载面板</DialogDrawerTitle>
          <DialogDrawerDescription>下载所选歌曲到本地磁盘</DialogDrawerDescription>
        </DialogDrawerHeader>

        <div className="border-divide flex items-center justify-between border-b px-2.5 pt-3 pb-3 shadow-xs md:mt-0">
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
          <DialogDrawer>
            <DialogDrawerTrigger asChild>
              <Button disabled={isDownloading || selected.size == 0} loading={isDownloading} size="sm">
                下载（{selected.size}）
              </Button>
            </DialogDrawerTrigger>
            <DialogDrawerContent dialogClassName="max-w-xl" drawerClassName="p-2 pt-0">
              <DialogDrawerHeader className="sr-only">
                <DialogDrawerTitle>下载</DialogDrawerTitle>
                <DialogDrawerDescription>设置下载参数</DialogDrawerDescription>
              </DialogDrawerHeader>
              <FieldGroup className="mt-2 gap-5">
                <Field>
                  <FieldTitle>下载项</FieldTitle>
                  <div className="space-y-2">
                    <FieldLabel>
                      <Field className="p-3!" orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>
                            <MusicIcon size={16} />
                            歌曲
                          </FieldTitle>
                        </FieldContent>
                        <Checkbox
                          checked={hasDownloadType('song')}
                          onCheckedChange={() => {
                            toggleDownloadType('song')
                          }}
                        />
                      </Field>
                    </FieldLabel>
                    <FieldLabel>
                      <Field className="p-3!" orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>
                            <ScrollTextIcon size={16} />
                            歌词
                          </FieldTitle>
                        </FieldContent>
                        <Checkbox
                          checked={hasDownloadType('lyric')}
                          onCheckedChange={() => {
                            toggleDownloadType('lyric')
                          }}
                        />
                      </Field>
                    </FieldLabel>
                  </div>
                </Field>
                <DisplayByConditional condition={hasDownloadType('song')}>
                  <Field>
                    <FieldTitle>音质</FieldTitle>
                    <Select
                      defaultValue={level}
                      disabled={isDownloading}
                      onValueChange={value => {
                        setLevel(value as LevelType)
                      }}
                    >
                      <SelectTrigger>
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
                  </Field>
                </DisplayByConditional>
              </FieldGroup>
              <DialogDrawerFooter className="mt-4 px-0">
                <DialogDrawerClose asChild className="min-w-40">
                  <Button disabled={downloadType.size == 0} onClick={handleDownload}>
                    确定
                  </Button>
                </DialogDrawerClose>
              </DialogDrawerFooter>
            </DialogDrawerContent>
          </DialogDrawer>
        </div>

        <List
          className="no-scrollbar"
          overscanCount={8}
          rowComponent={Row}
          rowCount={isDownloading ? selected.size : songs.length}
          rowHeight={48}
          rowProps={{
            getProgress,
            isDownloading,
            isSelected: hasSelected,
            songs: isDownloading ? Array.from(selected) : songs,
            onRowClick: toggleSelected
          }}
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
      style={{ backgroundSize: `${getProgress(song.id)?.progress ?? 0}%`, ...style }}
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
