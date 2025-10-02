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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getFileType } from '@/lib/file/info'
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

  const { data, isLoading, mutate } = useSWR(['0198eb99-6327-72b5-8a08-6629db4b7a53', path], () =>
    R2.list(path == '/' ? '' : (path.slice(1) as EndsWith<'/'>))
  )

  const isEmpty = data?.files.length == 0 && data?.folders.length == 0

  const { openViewer } = useImageViewerContext()
  /** 文件预览 */
  const handleFileReview = React.useCallback(
    (file: R2.FileInfo) => {
      if (!data) return
      switch (getFileType(file.contentType)) {
        case 'image':
          const images = data.files.filter(file => file.contentType?.startsWith('image'))
          openViewer({
            images: images.map(image => ({ key: image.key, src: R2.get(image.key) })),
            index: Math.max(
              0,
              images.findIndex(image => image.key == file.key)
            )
          })
          break
        case 'pdf':
          window.open(R2.get(file.key), '_blank')
          break
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
        {data?.folders.map(folder => (
          <TableRow
            key={folder}
            className="cursor-pointer"
            onClick={() => {
              router.replace(`/dashboard/r2/${folder}`)
            }}
          >
            <TableCell>
              <Folder size={18} />
            </TableCell>
            <TableCell>{folder.split('/').at(-2)}</TableCell>
            <TableCell colSpan={3} />
          </TableRow>
        ))}
        {/* 文件 */}
        {data?.files.map((file, index) => (
          <TableRow key={file.key}>
            <TableCell>
              <FileIconMap size={18} type={file.contentType} />
            </TableCell>
            <TableCell className="truncate">{file.key.split('/').at(-1)}</TableCell>
            <TableCell>{formatFileSize(file.size)}</TableCell>
            <TableCell>{formatISOTime(file.lastModified)}</TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-2">
                <TableActionButton
                  onClick={() => {
                    handleFileReview(file)
                  }}
                >
                  <Eye />
                </TableActionButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <TableActionButton>
                      <Link />
                    </TableActionButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="max-w-md">
                    {getFileLinks(file).map(link => (
                      <DropdownMenuItem
                        key={link}
                        className="cursor-pointer break-all"
                        onSelect={() => {
                          copy(link)
                          toast.success('复制成功')
                        }}
                      >
                        {link}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <TableDeleteButton
                  description="这将永久删除文件。"
                  title={file.key.slice(file.key.lastIndexOf('/') + 1)}
                  onConfirm={async () => {
                    await Toast(R2.delete([file.key]), {
                      description: file.key.slice(file.key.lastIndexOf('/') + 1),
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

/**
 * 文件图标
 */
const FileIconMap = ({
  type = '',
  ...props
}: LucideProps & {
  type?: string
}) => {
  switch (getFileType(type)) {
    case 'audio':
      return <FileAudio2 {...props} />
    case 'font':
      return <FileType2 {...props} />
    case 'image':
      return <FileImage {...props} />
    case 'json':
      return <FileJson2 {...props} />
    case 'text':
      return <FileText {...props} />
    case 'video':
      return <FileVideo2 {...props} />
    case 'zip':
      return <FileArchive {...props} />
    default:
      return <File {...props} />
  }
}

/**
 * 获取文件链接列表
 */
const getFileLinks = (file: R2.FileInfo) => {
  const links = [R2.get(file.key)]
  switch (getFileType(file.contentType)) {
    case 'image':
      const alt = file.key.split('/').at(-1)?.split('.')[0]
      const height = file.metadata.height
      const src = R2.get(file.key)
      const width = file.metadata.width
      links.push(`![${alt}](${src})`, `::img{alt="${alt}" src="${src}" width="${width}" height="${height}"}`)
      break
  }
  return links
}
