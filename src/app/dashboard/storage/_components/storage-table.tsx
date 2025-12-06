'use client'

import { produce } from 'immer'
import { CloudUpload, Eye, Folder, Link, Undo2 } from 'lucide-react'
import useSWR from 'swr'

import { DataTableWrapper } from '@/components/data-table'
import { DataTableRowActionButton, DataTableRowDeleteButton } from '@/components/data-table/data-table-action'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { rpc, unwrap } from '@/lib/http/rpc'
import { formatFileSize } from '@/lib/parser/size'
import { formatISOTime } from '@/lib/parser/time'
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
  const { data, isLoading, mutate } = useSWR(STORAGE_LIST_SWR_KEY(id), () => {
    return rpc.dashboard.storage.directories({ id }).get().then(unwrap)
  })

  const isEmpty = data?.directories.length == 0 && data?.files.length == 0

  return (
    <DataTableWrapper className={className}>
      <Table className="min-w-full">
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
                <DataTableRowActionButton>
                  <CloudUpload />
                </DataTableRowActionButton>
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
            <TableRow>
              <TableCell className="font-title cursor-default text-center" colSpan={5}>
                {isEmpty ? '内容为空' : 'Loading...'}
              </TableCell>
            </TableRow>
          </DisplayByConditional>
          {/* 文件夹 */}
          {data?.directories.map((directory, index) => (
            <TableRow
              key={directory.id}
              className="cursor-pointer"
              onClick={() => {
                onFolderRowClick?.(directory.id)
              }}
            >
              <TableCell>
                <Folder size={18} />
              </TableCell>
              <TableCell>{directory.name}</TableCell>
              <TableCell colSpan={2} />
              <TableCell
                className="text-right"
                onClick={event => {
                  event.stopPropagation()
                }}
              >
                <DataTableRowDeleteButton
                  description="这将永久删除文件夹。"
                  title={directory.name}
                  onConfirm={async () => {
                    await toastPromise(rpc.dashboard.storage.directories({ id: directory.id }).delete(), {
                      description: directory.name,
                      success: '删除成功'
                    })
                    await mutate(
                      produce<typeof data>(draft => {
                        draft.directories.splice(index, 1)
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
                  <DataTableRowActionButton>
                    <Eye />
                  </DataTableRowActionButton>
                </StorageFileView>
                <StorageFileLinkCopy file={file}>
                  <DataTableRowActionButton>
                    <Link />
                  </DataTableRowActionButton>
                </StorageFileLinkCopy>
                <DataTableRowDeleteButton
                  description="这将永久删除文件。"
                  title={[file.name, file.ext].filter(Boolean).join('.')}
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
      </Table>
    </DataTableWrapper>
  )
}
