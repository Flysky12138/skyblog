import { Download } from 'lucide-react'
import React from 'react'
import ReactDOM from 'react-dom'
import { useSet } from 'react-use'
import { FixedSizeList } from 'react-window'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui-custom/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ATTRIBUTE } from '@/lib/constants'

interface DownloadListProps {
  songs: AppRouteHandlerMethodMap['GET /api/netease-cloud-music/search']['return']['songs']
}

export const DownloadList = ({ songs }: DownloadListProps) => {
  const [selected, { add: selectedAdd, clear: selectedClear, has: selectedhas, toggle: selectedToggle }] = useSet<number>()

  const [el, setEl] = React.useState<HTMLElement | null>(null)
  React.useEffect(() => {
    setEl(document.getElementById(ATTRIBUTE.ID.NAV_CONTAINER))
  }, [])

  if (!el) return null
  if (!songs.length) return null

  return ReactDOM.createPortal(
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <Download />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl gap-0 p-0" showCloseButton={false}>
        <div className="border-divide flex border-b p-3 shadow-xs">
          <Button
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
          <Button className="ml-auto" size="sm">
            下载（{selected.size}）
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
                <img alt={song.al.name} decoding="async" height={36} loading="lazy" src={song.al.picUrl + '?param=72y72'} width={36} />
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
    </Dialog>,
    el
  )
}
