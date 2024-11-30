'use client'

import Card from '@/components/layout/Card'
import ModalCore, { ModalCoreRef } from '@/components/modal/ModalCore'
import { R2, R2FileInfoType } from '@/lib/server/r2'
import { groupBy } from 'es-toolkit'
import React from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'

export interface ModalCopyRef {
  open: (payload: R2FileInfoType[]) => void
}

const ModalCopy: React.ForwardRefRenderFunction<ModalCopyRef, {}> = (props, ref) => {
  const modalCoreRef = React.useRef<ModalCoreRef>()

  const [files, setFiles] = React.useState<R2FileInfoType[]>([])
  const imageFiles = React.useMemo(() => files.filter(file => file.contentType?.startsWith('image') || (file.metadata.width && file.metadata.height)), [files])

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
        values={imageFiles.map(file => `::img{alt="${file.key.split('/').at(-1)}" ${imageAttributes(file)} src="${R2.get(file.key)}"}`)}
      />
      <CardCopy
        title="component - images"
        values={Object.values(groupBy(imageFiles, file => file.key.slice(0, file.key.lastIndexOf('/')))).flatMap(files => [
          ':::images',
          ...files.map(file => `::img{alt="${file.key.split('/').at(-1)}" ${imageAttributes(file)} src="${R2.get(file.key)}"}`),
          ':::'
        ])}
      />
    </ModalCore>
  )
}

export default React.forwardRef(ModalCopy)

const imageAttributes = (file: R2FileInfoType) =>
  file.metadata.width && file.metadata.height ? `width="${file.metadata.width}" height="${file.metadata.height}"` : ''

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
        className="cursor-copy p-3"
        role="button"
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
