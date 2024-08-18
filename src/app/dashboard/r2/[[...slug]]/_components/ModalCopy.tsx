'use client'

import Card from '@/components/layout/Card'
import ModalCore, { ModalCoreRef } from '@/components/modal/ModalCore'
import { R2 } from '@/lib/server/r2'
import { R2Object } from '@cloudflare/workers-types/2023-07-01'
import React from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'

const CardCopy: React.FC<{ title: string; values: string[] }> = ({ title, values }) => {
  const [_, copy] = useCopyToClipboard()

  const handleCopy = () => {
    copy(values.join('\n'))
    toast.success('复制成功')
  }

  if (values.length == 0) return null

  return (
    <section>
      <p className="s-subtitle mb-2">{title}</p>
      <Card
        className="cursor-pointer p-3"
        tabIndex={0}
        onClick={handleCopy}
        onKeyDown={event => {
          if (event.key != 'Enter') return
          handleCopy()
        }}
      >
        <div className="s-hidden-scrollbar overflow-x-auto" tabIndex={-1}>
          {values.map((it, index) => (
            <p key={index} className="w-fit whitespace-nowrap">
              {it}
            </p>
          ))}
        </div>
      </Card>
    </section>
  )
}

export interface ModalCopyRef {
  open: (payload: R2Object[]) => void
}

const ModalCopy: React.ForwardRefRenderFunction<ModalCopyRef, {}> = (props, ref) => {
  const modalCoreRef = React.useRef<ModalCoreRef>()

  const [files, setFiles] = React.useState<R2Object[]>([])
  /** 图片 */
  const imageFiles = React.useMemo(
    () => files.filter(file => file.httpMetadata?.contentType?.startsWith('image') || (file.customMetadata?.['width'] && file.customMetadata?.['height'])),
    [files]
  )

  React.useImperativeHandle(ref, () => ({
    open: async payload => {
      setFiles(payload)
      modalCoreRef.current?.openToggle()
    }
  }))

  return (
    <ModalCore ref={modalCoreRef} className="w-full max-w-screen-md select-none gap-y-6" onClose={() => setFiles([])}>
      <CardCopy title="url" values={files.map(file => R2.get(file.key))} />
      <CardCopy title="markdown - img" values={imageFiles.map(file => `![${file.key.split('/').at(-1)}](${R2.get(file.key)})`)} />
      <CardCopy
        title="component - img"
        values={imageFiles.map(
          file =>
            `::img{alt="${file.key.split('/').at(-1)}" ${file.customMetadata?.['width'] && file.customMetadata?.['height'] ? `width="${file.customMetadata['width']}" height="${file.customMetadata['height']}"` : ''} src="${R2.get(file.key)}"}`
        )}
      />
      <CardCopy
        title="component - images"
        values={Array.from(
          imageFiles
            .reduce<Map<string, R2Object[]>>((pre, cur) => {
              const parentPath = cur.key.slice(0, cur.key.lastIndexOf('/'))
              pre.set(parentPath, (pre.get(parentPath) || []).concat(cur))
              return pre
            }, new Map())
            .values()
        ).flatMap(files => [
          ':::images',
          ...files.map(
            file =>
              `::img{alt="${file.key.split('/').at(-1)}" ${file.customMetadata?.['width'] && file.customMetadata?.['height'] ? `width="${file.customMetadata['width']}" height="${file.customMetadata['height']}"` : ''} src="${R2.get(file.key)}"}`
          ),
          ':::'
        ])}
      />
    </ModalCore>
  )
}

export default React.forwardRef(ModalCopy)
