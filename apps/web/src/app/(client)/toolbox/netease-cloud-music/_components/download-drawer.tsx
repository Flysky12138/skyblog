'use client'

import { toast } from '@repo/ui/base'
import { Button } from '@repo/ui/components/button'
import { Checkbox } from '@repo/ui/components/checkbox'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@repo/ui/components/drawer'
import { Field, FieldContent, FieldGroup, FieldLabel, FieldTitle } from '@repo/ui/components/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select'
import { useIsMobile } from '@repo/ui/hooks/use-mobile'
import { cn } from '@repo/ui/lib/utils'
import dayjs from 'dayjs'
import { mapAsync } from 'es-toolkit'
import { DownloadIcon, MusicIcon, ScrollTextIcon } from 'lucide-react'
import React from 'react'
import ReactDOM from 'react-dom'
import { useAsyncFn, useBeforeUnload, useMap, useSet } from 'react-use'
import { List, RowComponentProps } from 'react-window'

import { AlbumResponseType } from '@/app/api/[[...elysia]]/client/netease-cloud-music/model'
import { Show } from '@/components/show'
import { ATTRIBUTE } from '@/lib/constants'
import { AudioFFmpeg } from '@/lib/ffmpeg/audio'
import { DirectoryHelper } from '@/lib/helper/directory'
import { ProgressProps, readResponseProgress } from '@/lib/http/progress'
import { rpc, unwrap } from '@/lib/http/rpc'

import { LEVEL_OPTIONS, LevelType, REMOVE_ARTIST_BY_NAMES } from './utils'

interface DownloadDrawerProps {
  songs: AlbumResponseType['songs']
}

interface RowProps {
  disabled: boolean
  hasMore?: boolean
  songs: DownloadDrawerProps['songs']
  getProgress: (id: number) => ProgressProps | undefined
  isSelected: (song: RowProps['songs'][number]) => boolean
  onRowClick?: (song: RowProps['songs'][number]) => void
}

export function DownloadDrawer({ songs: staticSongs }: DownloadDrawerProps) {
  const songs = staticSongs.filter(song => !song.ar.some(ar => REMOVE_ARTIST_BY_NAMES.some(name => ar.name.includes(name))))

  const isMobile = useIsMobile()

  const [level, setLevel] = React.useState<LevelType>('hires')
  const [downloadType, { toggle: toggleDownloadType }] = useSet<'lyric' | 'song'>(new Set(['lyric', 'song']))

  const [selected, { add: addSelected, clear: clearSelected, toggle: toggleSelected }] = useSet<DownloadDrawerProps['songs'][number]>()
  const [progress, { get: getProgress, remove: removeProgress, reset: resetProgress, set: setProgress }] =
    useMap<Record<number, ProgressProps | undefined>>()

  const ffmpegRef = React.useRef<AudioFFmpeg>(null)

  React.useEffect(() => {
    return () => {
      clearSelected()
      resetProgress()
    }
  }, [clearSelected, resetProgress])

  const [{ loading: isDownloading }, handleDownload] = useAsyncFn(async () => {
    try {
      const helper = new DirectoryHelper()
      await helper.openDirectory({ mode: 'readwrite', startIn: 'music' })

      if (downloadType.has('song') && !ffmpegRef.current) {
        const ffmpeg = new AudioFFmpeg()
        await ffmpeg.init()
        ffmpegRef.current = ffmpeg
      }

      const downloadSong = async (song: DownloadDrawerProps['songs'][number]) => {
        if (!downloadType.has('song')) return
        if (!ffmpegRef.current) return
        const [{ type, url }] = await rpc['netease-cloud-music'].songs({ id: song.id }).url.get({ query: { level } }).then(unwrap)
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

      const downloadLyric = async (song: DownloadDrawerProps['songs'][number]) => {
        if (!downloadType.has('lyric')) return
        const { content } = await rpc['netease-cloud-music'].songs({ id: song.id }).lyric.get().then(unwrap)
        if (content) {
          await helper.writeFile(`${song?.name ?? song.id}.lrc`, content)
        } else {
          toast.error(`《${song.name}》没有歌词`)
        }
      }

      await mapAsync(
        Array.from(selected),
        async song => {
          try {
            await Promise.all([downloadSong(song), downloadLyric(song)])
            toggleSelected(song)
          } catch (error) {
            toast.error(`《${song.name}》下载失败`, {
              description: error instanceof Error ? error.message : String(error),
              richColors: true
            })
          } finally {
            removeProgress(song.id)
          }
        },
        {
          concurrency: 5
        }
      )
    } catch (error) {
      console.error(error)
    }
  }, [selected, level])

  useBeforeUnload(isDownloading, '正在下载中，不要关闭窗口')

  if (!songs.length) return null

  return (
    <Drawer showSwipeHandle={isMobile} swipeDirection={isMobile ? 'down' : 'right'}>
      {ReactDOM.createPortal(
        <DrawerTrigger
          render={
            <Button size="icon">
              <DownloadIcon />
            </Button>
          }
        />,
        document.getElementById(ATTRIBUTE.ID.NAV_CONTAINER_DOWNLOAD)!
      )}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>下载</DrawerTitle>
          <DrawerDescription>注意：文件覆盖不会有提示</DrawerDescription>
        </DrawerHeader>

        <List
          className="my-4 no-scrollbar scroll-fade-b"
          overscanCount={8}
          rowComponent={Row}
          rowCount={isDownloading ? selected.size : songs.length}
          rowHeight={48}
          rowProps={{
            disabled: isDownloading,
            getProgress,
            songs: isDownloading ? Array.from(selected) : songs,
            isSelected: song => selected.has(song),
            onRowClick: toggleSelected
          }}
          style={{ height: 48 * 10 }}
        />

        <DrawerFooter className="flex flex-row items-center gap-2 px-2.5">
          <Checkbox
            checked={selected.size === songs.length}
            className="size-8.5 cursor-pointer rounded-md **:[svg]:size-5!"
            disabled={isDownloading}
            onClick={() => {
              if (selected.size === songs.length) {
                clearSelected()
              } else {
                songs.forEach(addSelected)
              }
            }}
          />
          <Drawer showSwipeHandle={isMobile} swipeDirection={isMobile ? 'down' : 'right'}>
            <DrawerTrigger
              render={
                <Button className="grow" disabled={isDownloading || selected.size === 0} loading={isDownloading}>
                  下载（{selected.size}）
                </Button>
              }
            />
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>下载项</DrawerTitle>
                <DrawerDescription>选择需要下载的选项</DrawerDescription>
              </DrawerHeader>

              <FieldGroup className="gap-5 p-4">
                <Field>
                  <FieldTitle>选项</FieldTitle>
                  <div className="space-y-2">
                    <FieldLabel>
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>
                            <MusicIcon size={16} />
                            歌曲
                          </FieldTitle>
                        </FieldContent>
                        <Checkbox
                          checked={downloadType.has('song')}
                          onCheckedChange={() => {
                            toggleDownloadType('song')
                          }}
                        />
                      </Field>
                    </FieldLabel>
                    <FieldLabel>
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>
                            <ScrollTextIcon size={16} />
                            歌词
                          </FieldTitle>
                        </FieldContent>
                        <Checkbox
                          checked={downloadType.has('lyric')}
                          onCheckedChange={() => {
                            toggleDownloadType('lyric')
                          }}
                        />
                      </Field>
                    </FieldLabel>
                  </div>
                </Field>
                <Show when={downloadType.has('song')}>
                  <Field>
                    <FieldTitle>音质</FieldTitle>
                    <Select
                      disabled={isDownloading}
                      items={LEVEL_OPTIONS}
                      value={level}
                      onValueChange={value => {
                        if (!value) return
                        setLevel(value)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {LEVEL_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </Show>
              </FieldGroup>

              <DrawerFooter>
                <DrawerClose
                  render={
                    <Button
                      disabled={downloadType.size === 0}
                      onClick={() => {
                        void handleDownload()
                      }}
                    >
                      开始下载
                    </Button>
                  }
                />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function Row({ ariaAttributes, disabled, getProgress, index, isSelected, songs, style, onRowClick }: RowComponentProps & RowProps) {
  const song = songs[index]

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-2 px-1.5',
        'bg-linear-to-r bg-clip-padding bg-no-repeat',
        'from-indigo-200 via-purple-200 to-pink-200',
        'dark:from-indigo-800/30 dark:via-purple-800/30 dark:to-pink-800/30',
        {
          'border-t': index > 0
        }
      )}
      style={{ backgroundSize: `${getProgress(song.id)?.progress ?? 0}%`, ...style }}
      {...ariaAttributes}
      onClick={() => {
        if (disabled) return
        onRowClick?.(song)
      }}
    >
      {!disabled && <Checkbox checked={isSelected(song)} className="pointer-events-none mx-1" />}
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
        <p className="text-xs text-muted-foreground">{[song.ar.map(item => item.name).join('/'), song.al.name].filter(Boolean).join(' - ')}</p>
      </div>
    </div>
  )
}
