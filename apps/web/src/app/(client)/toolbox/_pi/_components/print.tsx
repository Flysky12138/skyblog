'use client'

import { Button } from '@repo/ui/components/button'
import { chunk } from 'es-toolkit'
import { DownloadIcon, XIcon } from 'lucide-react'
import React from 'react'
import { useMeasure } from 'react-use'
import { List } from 'react-window'

import { FileHelper } from '@/lib/helper/file'

interface PrintProps {
  pi: string
  size: number
  time: number
  onClose: () => void
}

export function Print({ pi, size, time, onClose }: PrintProps) {
  const [divRef, { width }] = useMeasure<HTMLDivElement>()
  const [fontRef, { width: fontWidth }] = useMeasure<HTMLSpanElement>()

  const [piChunk, setPiChunk] = React.useState<string[][]>([])

  React.useEffect(() => {
    if ([width, fontWidth].some(it => it <= 0)) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPiChunk(chunk(Array.from(pi), Math.floor((width - 24) / fontWidth)))
  }, [fontWidth, pi, width])

  return (
    <div ref={divRef} className="flex flex-col gap-3">
      <span ref={fontRef} aria-hidden="true" className="invisible absolute h-0 self-start font-code">
        3
      </span>

      <div className="flex items-center justify-end gap-2">
        耗时 {time > 1000 ? `${(time / 1000).toFixed(3)} 秒` : `${time.toFixed(1)} 毫秒`}
        <Button
          className="text-sm"
          size="sm"
          variant="secondary"
          onClick={() => {
            FileHelper.downloadFile(pi, `pi-${size}.txt`, 'text/plain;charset=utf-8')
          }}
        >
          <DownloadIcon /> 下载
        </Button>
        <Button className="text-sm" size="sm" variant="secondary" onClick={onClose}>
          <XIcon /> 关闭
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-input bg-sheet px-3 py-2 font-code">
        <List
          className="no-scrollbar h-100"
          overscanCount={10}
          rowComponent={({ index, style }) => (
            <span key={index} style={style}>
              {piChunk[index]}
            </span>
          )}
          rowCount={piChunk.length}
          rowHeight={20}
          rowProps={{}}
        />
      </div>
    </div>
  )
}
