'use client'

import Card from '@/components/layout/Card'
import ModalCore, { ModalCoreRef } from '@/components/modal/ModalCore'
import { cn } from '@/lib/cn'
import { EXT } from '@/lib/constants'
import { ImageFileInfoType } from '@/lib/file/info'
import { githubFileDirectUrl } from '@/lib/server/github'
import { CustomRequest } from '@/lib/server/request'
import React from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'

const CardCopy: React.FC<{ loading: boolean; title: string; values: string[] }> = ({ title, values, loading }) => {
  const [_, copy] = useCopyToClipboard()

  const handleCopy = () => {
    copy(values.join('\n'))
    toast.success('复制成功')
  }

  if (!loading && values.length == 0) return null

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
          's-skeleton h-8 rounded': loading
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

type FileType = (GithubRepoCommon | GithubRepoTree['tree'][number]) & Partial<ImageFileInfoType>
export interface CopyLinkRef {
  asyncOpen: (payload: FileType[]) => void
  open: (payload: FileType[]) => Promise<void>
}

export default React.forwardRef<CopyLinkRef, {}>(function CopyLink(props, ref) {
  const modalCoreRef = React.useRef<ModalCoreRef>()

  const [loading, setLoading] = React.useState(false)
  const [files, setFiles] = React.useState<FileType[]>([])
  const imageFiles = React.useMemo(() => files.filter(file => EXT.IMAGE.some(ext => file.path.endsWith(ext))), [files])

  React.useImperativeHandle(ref, () => ({
    asyncOpen: async payload => {
      modalCoreRef.current?.openToggle()
      setLoading(true)
      try {
        const info = await CustomRequest('GET api/dashboard/image-info', {})
        const infoMap = new Map(Object.entries(info.data))
        setFiles(payload.map(v => Object.assign({}, v, infoMap.has(v.sha) ? infoMap.get(v.sha) : {})))
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    },
    open: async payload => {
      setFiles(payload)
      modalCoreRef.current?.openToggle()
    }
  }))

  return (
    <ModalCore ref={modalCoreRef} className="w-full max-w-screen-md select-none gap-y-10 py-7" onClose={() => setFiles([])}>
      <CardCopy loading={loading} title="url" values={files.map(file => process.env.NEXT_PUBLIC_WEBSITE_URL + githubFileDirectUrl(file.path))} />
      <CardCopy loading={loading} title="markdown - img" values={imageFiles.map(file => `![${imageAlt(file.path)}](${githubFileDirectUrl(file.path)})`)} />
      <CardCopy
        loading={loading}
        title="component - img"
        values={imageFiles.map(
          file =>
            `::img{alt="${imageAlt(file.path)}" ${file.width && file.height ? `width="${file.width}" height="${file.height}"` : ''} src="${githubFileDirectUrl(file.path)}"}`
        )}
      />
      <CardCopy
        loading={loading}
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
