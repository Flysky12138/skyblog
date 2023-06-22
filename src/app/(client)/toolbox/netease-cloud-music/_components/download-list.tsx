'use client'

import { Download } from 'lucide-react'
import React from 'react'
import { useAsyncFn, useBeforeUnload, useMap, useSet } from 'react-use'
import { FixedSizeList } from 'react-window'
import { toast } from 'sonner'

import {
  DialogDrawer,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerHeader,
  DialogDrawerTitle,
  DialogDrawerTrigger
} from '@/components/dialog-drawer'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Portal } from '@/components/utils/portal'
import { ATTRIBUTE } from '@/lib/constants'
import { DirectoryHelper } from '@/lib/file/directory-helper'
import { FFmpeg } from '@/lib/file/ffmpeg'
import { ProgressProps, readResponseProgress } from '@/lib/http/progress'
import { CustomRequest } from '@/lib/http/request'
import { promisePool } from '@/lib/promise'
import { cn } from '@/lib/utils'

type LevelType = AppRouteHandlerMethodMap['GET /api/netease-cloud-music/song/url']['return'][number]['level']

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

interface DownloadListProps {
  songs: AppRouteHandlerMethodMap['GET /api/netease-cloud-music/search']['return']['songs']
}

export const DownloadList = ({ songs }: DownloadListProps) => {
  songs = songs.filter(song => !song.ar.some(ar => REMOVE_ARTIST_NAMES.some(name => ar.name.includes(name))))

  const [level, setLevel] = React.useState<LevelType>('lossless')
  const [selected, { add: selectedAdd, clear: selectedClear, has: selectedhas, toggle: selectedToggle }] =
    useSet<DownloadListProps['songs'][number]>()
  const [progress, { get: progressGet, remove: progressRemove, set: progressSet }] = useMap<Record<number, ProgressProps | undefined>>()

  const [{ loading: isDownloading }, handleDownload] = useAsyncFn(async () => {
    const helper = new DirectoryHelper()
    await helper.openDirectory({ mode: 'readwrite', startIn: 'music' })

    const ffmpeg = new FFmpeg()
    await ffmpeg.init()

    return promisePool(
      Array.from(selected).map(song => async () => {
        try {
          const [{ md5, type, url }] = await CustomRequest('GET /api/netease-cloud-music/song/url', { search: { id: song.id, level } })
          if (!url) throw new Error([song.ar[0].name, song.al.name].filter(Boolean).join(' - '))

          const audioBlob = await fetch(url.replace('http:', 'https:')).then(async res => {
            return readResponseProgress(res, payload => progressSet(song.id, payload))
          })
          const coverBlob = await fetch(song.al.picUrl.replace('http:', 'https:') + '?param=1200y1200').then(res => res.blob())

          const audio = await ffmpeg.updateAudioMetadata({
            audio: { content: audioBlob, ext: type },
            cover: { content: coverBlob, ext: 'jpg' },
            metadata: { album: song.al.name, artist: song.ar.map(ar => ar.name).join(', '), title: song.name }
          })

          await helper.writeFile(`${song?.name || md5}.${type}`, audio)

          selectedToggle(song)
          progressRemove(song.id)
        } catch (error) {
          toast.error('下载歌曲失败', {
            description: error instanceof Error ? error.message : (error as string),
            richColors: true
          })
        }
      })
    )
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
        <DialogDrawerHeader className="hidden">
          <DialogDrawerTitle />
          <DialogDrawerDescription />
        </DialogDrawerHeader>
        <div className="border-divide flex items-center gap-2 border-b px-2.5 pt-3 pb-3 shadow-xs md:mt-0">
          <Checkbox
            checked={selected.size == songs.length ? true : selected.size == 0 ? false : 'indeterminate'}
            disabled={isDownloading}
            onClick={() => {
              if (selected.size == songs.length) {
                selectedClear()
              } else {
                songs.forEach(selectedAdd)
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
          <Button className="select-none" disabled={isDownloading || selected.size == 0} size="sm" onClick={handleDownload}>
            {isDownloading && <Spinner />} 下载（{selected.size}）
          </Button>
        </div>
        <FixedSizeList
          className="scrollbar-hidden"
          height={48 * 10}
          itemCount={isDownloading ? selected.size : songs.length}
          itemData={isDownloading ? Array.from(selected) : songs}
          itemSize={48}
          overscanCount={8}
          width="100%"
        >
          {({ data, index, style }) => {
            const song = data[index]
            return (
              <div
                className={cn(
                  'flex cursor-pointer items-center gap-2 border-b px-1.5 last:border-b-0',
                  'bg-linear-to-r bg-clip-padding bg-no-repeat',
                  'from-indigo-200 via-purple-200 to-pink-200',
                  'dark:from-indigo-800/30 dark:via-purple-800/30 dark:to-pink-800/30'
                )}
                style={{ backgroundSize: `${progressGet(song.id)?.progress || 0}%`, ...style }}
                onClick={() => {
                  if (isDownloading) return
                  selectedToggle(song)
                }}
              >
                {!isDownloading && <Checkbox checked={selectedhas(song)} className="mx-1" />}
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
      </DialogDrawerContent>
    </DialogDrawer>
  )
}
