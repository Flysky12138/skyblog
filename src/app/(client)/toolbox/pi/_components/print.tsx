'use client'

import { chunk } from 'es-toolkit'
import { Download, X } from 'lucide-react'
import React from 'react'
import { useMeasure } from 'react-use'
import { List } from 'react-window'

import { Button } from '@/components/ui/button'
import { download } from '@/lib/file/download'

interface PrintProps {
  pi: string
  size: number
  time: number
  onClose: () => void
}

export const Print = React.memo(function Print({ pi, size, time, onClose }: PrintProps) {
  const [divRef, { width }] = useMeasure<HTMLDivElement>()
  const [fontRef, { width: fontWidth }] = useMeasure<HTMLSpanElement>()

  const [piChunk, setPiChunk] = React.useState<string[][]>([])

  React.useEffect(() => {
    if ([width, fontWidth].some(it => it <= 0)) return
    setPiChunk(chunk(Array.from(pi), Math.floor((width - 24) / fontWidth)))
  }, [fontWidth, pi, width])

  return (
    <div ref={divRef} className="flex flex-col gap-3">
      <span ref={fontRef} aria-hidden="true" className="font-code invisible absolute h-0 self-start">
        3
      </span>

      <div className="flex items-center justify-end gap-2">
        耗时 {time > 1000 ? `${(time / 1000).toFixed(3)} 秒` : `${time.toFixed(1)} 毫秒`}
        <Button
          className="text-sm"
          size="sm"
          variant="secondary"
          onClick={() => {
            const blob = new Blob([piChunk.join('')], { type: 'text/plain;charset=utf-8' })
            download(blob, `pi-${size}.txt`)
          }}
        >
          <Download /> 下载
        </Button>
        <Button className="text-sm" size="sm" variant="secondary" onClick={onClose}>
          <X /> 关闭
        </Button>
      </div>

      <div className="bg-sheet border-input font-code overflow-hidden rounded-lg border px-3 py-2">
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
})
