'use client'

import { produce } from 'immer'
import { CloudUpload, Eye, Folder, Link, Undo2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
import { formatFileSize } from '@/lib/parser/size'
import { formatISOTime } from '@/lib/parser/time'
import { rpc, unwrap } from '@/lib/rpc'
import { toastPromise } from '@/lib/toast'

import { StorageFileIcon } from './storage-file-icon'
import { StorageFileLinkCopy } from './storage-file-link-copy'
import { StorageFileView } from './storage-file-view'
import { StorageUploadModal } from './storage-upload-modal'
import { STORAGE_LIST_SWR_KEY } from './utils'

interface StorageTableProps {
  className?: string
  id: string
  onFolderRowClick?: (id: string) => void
}

export function StorageTable({ className, id, onFolderRowClick }: StorageTableProps) {
  const router = useRouter()

  const { data, isLoading, mutate } = useSWR(STORAGE_LIST_SWR_KEY(id), () => {
    return rpc.dashboard.storage.directories({ id }).get().then(unwrap)
  })

  const isEmpty = data?.directories.length == 0 && data?.files.length == 0

  return (
    <TablePrimitive className={className}>
      <colgroup>
        <col width="42" />
        <col style={{ minWidth: 250, width: 'fit-content' }} />
        <col width="120" />
        <col width="180" />
        <col width="140" />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>名称</TableHead>
          <TableHead>大小</TableHead>
          <TableHead>修改时间</TableHead>
          <TableHead className="space-x-2 text-right">
            {/* <StorageFileMoveModal id={id}>
              <TableActionButton>
                <ArrowRightLeft />
              </TableActionButton>
            </StorageFileMoveModal> */}
            <StorageUploadModal
              id={id}
              onUploaded={async payload => {
                if (!data) {
                  await mutate()
                  return
                }
                if (data.parentDirectory.id != payload.directoryId) return
                await mutate(
                  produce<typeof data>(draft => {
                    draft.files.push(payload)
                  }),
                  {
                    revalidate: false
                  }
                )
              }}
            >
              <TableActionButton>
                <CloudUpload />
              </TableActionButton>
            </StorageUploadModal>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* 返回上层 */}
        {!isLoading && data && !data.parentDirectory.isRoot && (
          <TableRow
            className="cursor-pointer"
            onClick={() => {
              router.push(`/dashboard/storage?id=${data.parentDirectory.parentId}`)
              onFolderRowClick?.(data.parentDirectory.parentId)
            }}
          >
            <TableCell>
              <Undo2 size={18} />
            </TableCell>
            <TableCell className="tracking-widest select-none" colSpan={4}>
              ..
            </TableCell>
          </TableRow>
        )}
        {/* 加载状态 */}
        <DisplayByConditional condition={isLoading || isEmpty}>
          <TableRowLoading colSpan={5}>{isEmpty && '内容为空'}</TableRowLoading>
        </DisplayByConditional>
        {/* 文件夹 */}
        {data?.directories.map(directory => (
          <TableRow
            key={directory.id}
            className="cursor-pointer"
            onClick={() => {
              router.push(`/dashboard/storage?id=${directory.id}`)
              onFolderRowClick?.(directory.id)
            }}
          >
            <TableCell>
              <Folder size={18} />
            </TableCell>
            <TableCell>{directory.name}</TableCell>
            <TableCell colSpan={3} />
          </TableRow>
        ))}
        {/* 文件 */}
        {data?.files.map((file, index) => (
          <TableRow key={file.id}>
            <TableCell>
              <StorageFileIcon mimeType={file.mimeType} size={18} />
            </TableCell>
            <TableCell className="truncate">{[file.name, file.ext].filter(Boolean).join('.')}</TableCell>
            <TableCell>{formatFileSize(Number(file.size))}</TableCell>
            <TableCell>{formatISOTime(file.updatedAt)}</TableCell>
            <TableCell className="space-x-2 text-right">
              <StorageFileView asChild file={file}>
                <TableActionButton>
                  <Eye />
                </TableActionButton>
              </StorageFileView>
              <StorageFileLinkCopy file={file}>
                <TableActionButton>
                  <Link />
                </TableActionButton>
              </StorageFileLinkCopy>
              <TableDeleteButton
                description="这将永久删除文件。"
                title={file.name}
                onConfirm={async () => {
                  await toastPromise(rpc.dashboard.storage.files({ id: file.id }).delete(), {
                    description: file.name,
                    success: '删除成功'
                  })
                  await mutate(
                    produce<typeof data>(draft => {
                      draft.files.splice(index, 1)
                    }),
                    {
                      revalidate: false
                    }
                  )
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TablePrimitive>
  )
}
