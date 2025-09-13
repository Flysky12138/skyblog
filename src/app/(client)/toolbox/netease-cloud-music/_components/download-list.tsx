'use client'

import { Download } from 'lucide-react'
import React from 'react'
import { useAsyncFn, useBeforeUnload, useMap, useSet } from 'react-use'
import { FixedSizeList } from 'react-window'

import { Portal } from '@/components/layout/portal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { ATTRIBUTE } from '@/lib/constants'
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

interface DownloadListProps {
  songs: AppRouteHandlerMethodMap['GET /api/netease-cloud-music/search']['return']['songs']
}

export const DownloadList = ({ songs }: DownloadListProps) => {
  const [level, setLevel] = React.useState<LevelType>('jymaster')
  const [selected, { add: selectedAdd, clear: selectedClear, has: selectedhas, toggle: selectedToggle }] =
    useSet<DownloadListProps['songs'][number]>()
  const [progress, { get: progressGet, remove: progressRemove, set: progressSet }] = useMap<Record<number, ProgressProps | undefined>>()

  const [{ loading: isDownloading }, handleDownload] = useAsyncFn(async () => {
    const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' })
    return promisePool(
      Array.from(selected).map(song => async () => {
        const [{ md5, type, url }] = await CustomRequest('GET /api/netease-cloud-music/song/url', { search: { id: song.id, level } })
        const blob = await fetch(url.replace('http:', 'https:')).then(res => readResponseProgress(res, payload => progressSet(song.id, payload)))
        const fileHandle = await dirHandle.getFileHandle(`${song?.name || md5}.${type}`, { create: true })
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
        selectedToggle(song)
        progressRemove(song.id)
      })
    )
  }, [selected, level])

  useBeforeUnload(isDownloading, '正在下载中，不要关闭窗口')

  if (!songs.length) return null

  return (
    <Drawer>
      <Portal selector={`#${ATTRIBUTE.ID.NAV_CONTAINER}`}>
        <DrawerTrigger asChild>
          <Button size="icon">
            <Download />
          </Button>
        </DrawerTrigger>
      </Portal>
      <DrawerContent className="mx-auto max-w-3xl border outline-none">
        <div className="border-divide mt-2 flex gap-2 border-b px-2 py-3 shadow-xs">
          <Button
            disabled={isDownloading}
            size="sm"
            variant="outline"
            onClick={() => {
              if (selected.size == songs.length) {
                selectedClear()
              } else {
                songs.forEach(selectedAdd)
              }
            }}
          >
            {selected.size == songs.length ? '取消全选' : '全选'}
          </Button>
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
          height={480}
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
                  <p className="text-muted-foreground text-xs">
                    {song.ar[0].name} - {song.al.name}
                  </p>
                </div>
              </div>
            )
          }}
        </FixedSizeList>
      </DrawerContent>
    </Drawer>
  )
}
