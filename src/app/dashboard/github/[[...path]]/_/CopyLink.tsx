'use client'

import { ImageInfoGetResponseType } from '@/app/api/dashboard/image-info/route'
import Card from '@/components/layout/Card'
import ModalCore, { ModalCoreRef } from '@/components/modal/ModalCore'
import { cn } from '@/lib/cn'
import { ImageFileInfoType } from '@/lib/fileInfo'
import { EXT } from '@/lib/keys'
import { CustomFetch } from '@/lib/server/fetch'
import { githubFileDirectUrl } from '@/lib/server/github'
import React from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'

const getImageInfo = async () => {
  return await CustomFetch<ImageInfoGetResponseType>('/api/dashboard/image-info')
}

const CardCopy = ({ title, values }: { title: string; values: string[] }) => {
  const [_, copy] = useCopyToClipboard()

  const handleCopy = () => {
    copy(values.join('\n'))
    toast.success('复制成功')
  }

  return (
    <Card
      className="cursor-pointer p-3 pt-5"
      tabIndex={0}
      title={title}
      onClick={handleCopy}
      onKeyDown={event => {
        if (event.key != 'Enter') return
        handleCopy()
      }}
    >
      <div
        className={cn('s-hidden-scrollbar overflow-x-auto', {
          's-skeleton h-8 rounded': values.length == 0
        })}
      >
        {values.map((v, i) => (
          <p key={i} className="w-fit whitespace-nowrap">
            {v}
          </p>
        ))}
      </div>
    </Card>
  )
}

const imageAlt = (path: string) => path.split('/').at(-2) || ''

type FileType = (GithubRepoCommonType | GithubRepoTreeType['tree'][number]) & Partial<ImageFileInfoType>
export interface CopyLinkRef {
  asyncOpen: (payload: FileType[]) => void
  open: (payload: FileType[]) => Promise<void>
}

export default React.forwardRef<CopyLinkRef, {}>(function CopyLink(props, ref) {
  const modalCoreRef = React.useRef<ModalCoreRef>()

  const [files, setFiles] = React.useState<FileType[]>([])
  const imageFiles = React.useMemo(() => files.filter(file => EXT.IMAGE.some(ext => file.path.endsWith(ext))), [files])

  React.useImperativeHandle(ref, () => ({
    asyncOpen: async payload => {
      modalCoreRef.current?.openToggle()
      const info = await getImageInfo()
      const infoMap = new Map(Object.entries(info.data))
      setFiles(payload.map(v => Object.assign({}, v, infoMap.has(v.sha) ? infoMap.get(v.sha) : {})))
    },
    open: async payload => {
      setFiles(payload)
      modalCoreRef.current?.openToggle()
    }
  }))

  return (
    <ModalCore ref={modalCoreRef} className="w-full max-w-screen-md select-none gap-y-10 py-7" onClose={() => setFiles([])}>
      <CardCopy title="url" values={files.map(file => githubFileDirectUrl(file.path))} />
      <CardCopy title="markdown - img" values={imageFiles.map(file => `![${imageAlt(file.path)}](${githubFileDirectUrl(file.path)})`)} />
      <CardCopy
        title="component - img"
        values={imageFiles.map(
          file =>
            `::img{alt="${imageAlt(file.path)}" ${file.width && file.height ? `width="${file.width}" height="${file.height}"` : ''} src="${githubFileDirectUrl(file.path)}"}`
        )}
      />
      <CardCopy
        title="component - images"
        values={Array.from(
          imageFiles
            .reduce<Map<string, FileType[]>>((pre, cur) => {
              const parentPath = cur.path.slice(0, cur.path.lastIndexOf('/'))
              pre.set(parentPath, (pre.get(parentPath) || []).concat(cur))
              return pre
            }, new Map())
            .values()
        ).flatMap(files => [
          ':::images',
          ...files.map(
            file =>
              `::img{alt="${imageAlt(file.path)}" ${file.width && file.height ? `width="${file.width}" height="${file.height}"` : ''} src="${githubFileDirectUrl(file.path)}"}`
          ),
          ':::'
        ])}
      />
    </ModalCore>
  )
})
