'use client'

import { produce } from 'immer'
import {
  CloudUpload,
  Eye,
  File,
  FileArchive,
  FileAudio2,
  FileImage,
  FileJson2,
  FileText,
  FileType2,
  FileVideo2,
  Folder,
  Link,
  LucideProps,
  Undo2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import {
  TableActionButton,
  TableBody,
  TableCell,
  TableDeleteButton,
  TableHead,
  TableHeader,
  TablePrimitive,
  TableRow,
  TableRowLoading
} from '@/components/table'
import { R2 } from '@/lib/http/r2'
import { formatFileSize } from '@/lib/parser/size'
import { formatISOTime } from '@/lib/parser/time'
import { Toast } from '@/lib/toast'
import { useImageViewerContext } from '@/providers/image-viewer'

import { R2Upload } from './r2-upload'

interface R2TableProps {
  className?: string
  hiddenParentDirectoryRow?: boolean
  hiddenUploadButton?: boolean
  paths?: string[]
}

export const R2Table = ({ className, hiddenParentDirectoryRow, hiddenUploadButton, paths }: R2TableProps) => {
  const router = useRouter()
  const [{}, copy] = useCopyToClipboard()

  const path = decodeURIComponent(paths?.length ? `/${paths.join('/')}/` : '/') as FilePathType

  const { data, isLoading, mutate } = useSWR(
    ['3e7d7b49-e149-57c5-9e16-4396344fc8e9', path],
    () => R2.list(path == '/' ? '' : (path.slice(1) as EndsWith<'/'>)),
    {
      keepPreviousData: true
    }
  )

  const isEmpty = data?.files.length == 0 && data?.folders.length == 0

  const { openViewer } = useImageViewerContext()
  /** 文件点击 */
  const handleFileRowClick = React.useCallback(
    (file: R2.FileInfo) => {
      if (!data) return
      if (file.contentType?.startsWith('image')) {
        const images = data.files.filter(it => it.contentType?.startsWith('image'))
        openViewer({
          images: images.map(image => ({ key: image.key, src: R2.get(image.key) })),
          index: Math.max(
            0,
            images.findIndex(image => image.key == file.key)
          )
        })
      }
    },
    [data, openViewer]
  )

  return (
    <TablePrimitive className={className}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10" />
          <TableHead>名称</TableHead>
          <TableHead className="w-28">大小</TableHead>
          <TableHead className="w-44">修改时间</TableHead>
          <TableHead className="w-36 text-right">
            <DisplayByConditional condition={!hiddenUploadButton}>
              <R2Upload path={path} onFinished={mutate}>
                <TableActionButton>
                  <CloudUpload />
                </TableActionButton>
              </R2Upload>
            </DisplayByConditional>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* 返回上层 */}
        <DisplayByConditional condition={!!paths?.length && !hiddenParentDirectoryRow}>
          <TableRow
            className="cursor-pointer"
            onClick={() => {
              router.replace(`/dashboard/r2/${paths!.slice(0, -1).join('/')}`)
            }}
          >
            <TableCell>
              <Undo2 size={18} />
            </TableCell>
            <TableCell className="tracking-widest select-none" colSpan={4}>
              ..
            </TableCell>
          </TableRow>
        </DisplayByConditional>
        {/* 加载状态 */}
        <DisplayByConditional condition={isLoading || isEmpty}>
          <TableRowLoading colSpan={5}>{isEmpty && '内容为空'}</TableRowLoading>
        </DisplayByConditional>
        {/* 文件夹 */}
        {data?.folders.map(it => (
          <TableRow
            key={it}
            className="cursor-pointer"
            onClick={() => {
              router.replace(`/dashboard/r2/${it}`)
            }}
          >
            <TableCell>
              <Folder size={18} />
            </TableCell>
            <TableCell>{it.split('/').at(-2)}</TableCell>
            <TableCell colSpan={3} />
          </TableRow>
        ))}
        {/* 文件 */}
        {data?.files.map((it, index) => (
          <TableRow key={it.key}>
            <TableCell>
              <FileIconMap size={18} type={it.contentType} />
            </TableCell>
            <TableCell className="truncate">{it.key.split('/').at(-1)}</TableCell>
            <TableCell>{formatFileSize(it.size)}</TableCell>
            <TableCell>{formatISOTime(it.lastModified)}</TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-2">
                <TableActionButton
                  onClick={() => {
                    handleFileRowClick(it)
                  }}
                >
                  <Eye />
                </TableActionButton>
                <TableActionButton
                  onClick={() => {
                    copy(R2.get(it.key))
                    toast.success('复制成功')
                  }}
                >
                  <Link />
                </TableActionButton>
                <TableDeleteButton
                  description="这将永久删除文件。"
                  title={it.key.slice(it.key.lastIndexOf('/') + 1)}
                  onConfirm={async () => {
                    await Toast(R2.delete([it.key]), {
                      description: it.key.slice(it.key.lastIndexOf('/') + 1),
                      success: '删除成功'
                    })
                    await mutate(
                      produce(state => {
                        state.files.splice(index, 1)
                      }),
                      {
                        revalidate: false
                      }
                    )
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TablePrimitive>
  )
}

/** 文件图标 */
const FileIconMap: React.FC<
  LucideProps & {
    type?: string
  }
> = ({ type = '', ...props }) => {
  if (type.startsWith('image')) return <FileImage {...props} />
  if (type.startsWith('audio')) return <FileAudio2 {...props} />
  if (type.startsWith('video')) return <FileVideo2 {...props} />
  if (type.startsWith('font')) return <FileType2 {...props} />
  if (type.startsWith('text')) return <FileText {...props} />
  if (type.startsWith('application/json')) return <FileJson2 {...props} />
  if (type.startsWith('application/zip')) return <FileArchive {...props} />
  return <File {...props} />
}
