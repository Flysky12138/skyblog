'use client'

import { Download } from 'lucide-react'
import React from 'react'
import { useAsyncFn, useBeforeUnload, useSet } from 'react-use'
import { FixedSizeList } from 'react-window'

import { Portal } from '@/components/layout/portal'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { ATTRIBUTE } from '@/lib/constants'
import { CustomRequest } from '@/lib/http/request'
import { promisePool } from '@/lib/promise'
import { Toast } from '@/lib/toast'

type Level = AppRouteHandlerMethodMap['GET /api/netease-cloud-music/song/url']['return'][number]['level']

const LEVEL_OPTIONS: { label: string; value: Level }[] = [
  { label: '超清母带', value: 'jymaster' },
  { label: '沉浸环绕声', value: 'sky' },
  { label: '高清环绕声', value: 'jyeffect' },
  { label: 'Hi-Res', value: 'hires' },
  { label: '无损', value: 'lossless' },
  { label: '极高', value: 'exhigh' },
  { label: '较高', value: 'higher' },
  { label: '标准', value: 'standard' }
]

interface DownloadListProps {
  songs: AppRouteHandlerMethodMap['GET /api/netease-cloud-music/search']['return']['songs']
}

export const DownloadList = ({ songs }: DownloadListProps) => {
  const [selected, { add: selectedAdd, clear: selectedClear, has: selectedhas, toggle: selectedToggle }] = useSet<number>()
  const [level, setLevel] = React.useState<Level>('jymaster')

  const [{ loading: isDownloading }, handleDownload] = useAsyncFn(async () => {
    const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' }) // 选择保存文件夹
    return promisePool(
      Array.from(selected).map(id => {
        const song = songs.find(song => song.id == id)
        const promise = async () => {
          const [{ md5, type, url }] = await CustomRequest('GET /api/netease-cloud-music/song/url', { search: { id, level } })
          const blob = await fetch(url.replace('http:', 'https:')).then(res => res.blob())
          // 保存文件
          const fileHandle = await dirHandle.getFileHandle(`${song?.name || md5}.${type}`, { create: true })
          const writable = await fileHandle.createWritable()
          await writable.write(blob)
          await writable.close()
          selectedToggle(id)
        }
        return async () => {
          return Toast(promise(), {
            description: song?.name,
            richColors: true,
            success: '下载成功',
            toasterId: 'expand',
            error: e => e.message
          })
        }
      })
    )
  }, [selected, level])

  useBeforeUnload(isDownloading, '正在下载中，不要关闭窗口')

  if (!songs.length) return null

  return (
    <Portal selector={`#${ATTRIBUTE.ID.NAV_CONTAINER}`}>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon">
            <Download />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl gap-0 p-0" showCloseButton={false}>
          <div className="border-divide flex gap-2 border-b p-3 shadow-xs">
            <Button
              disabled={isDownloading}
              size="sm"
              variant="outline"
              onClick={() => {
                if (selected.size == songs.length) {
                  selectedClear()
                } else {
                  songs.forEach(song => {
                    selectedAdd(song.id)
                  })
                }
              }}
            >
              {selected.size == songs.length ? '取消全选' : '全选'}
            </Button>
            <Select
              defaultValue={level}
              disabled={isDownloading}
              onValueChange={value => {
                setLevel(value as Level)
              }}
            >
              <SelectTrigger className="ml-auto w-32" size="sm">
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
            height={500}
            itemCount={songs.length}
            itemData={songs}
            itemSize={48}
            overscanCount={8}
            width="100%"
          >
            {({ data, index, style }) => {
              const song = data[index]
              return (
                <div
                  className="flex cursor-pointer items-center gap-2 border-b px-1.5 last:border-b-0"
                  style={style}
                  onClick={() => {
                    selectedToggle(song.id)
                  }}
                >
                  <Checkbox checked={selectedhas(song.id)} className="mx-1" />
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
        </DialogContent>
      </Dialog>
    </Portal>
  )
}
