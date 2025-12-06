'use client'

import { Folder, Link, Undo2 } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { TableActionButton, TableBody, TableCell, TableHead, TableHeader, TablePrimitive, TableRow, TableRowLoading } from '@/components/table'
import { formatFileSize } from '@/lib/parser/size'
import { rpc, unwrap } from '@/lib/rpc'

import { StorageFileIcon } from './storage-file-icon'
import { StorageFileLinkCopy } from './storage-file-link-copy'
import { STORAGE_LIST_SWR_KEY } from './utils'

interface StorageTable2Props {
  className?: string
  id: string
}

export function StorageTable2({ className, id }: StorageTable2Props) {
  const [directoryId, setDirectoryId] = React.useState(id)

  const { data, isLoading } = useSWR(STORAGE_LIST_SWR_KEY(directoryId), () => {
    return rpc.dashboard.storage.directories({ id: directoryId }).get().then(unwrap)
  })

  const isEmpty = data?.directories.length == 0 && data?.files.length == 0

  return (
    <TablePrimitive className={className}>
      <colgroup>
        <col width="42" />
        <col style={{ minWidth: 250, width: 'fit-content' }} />
        <col width="120" />
        <col width="80" />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>名称</TableHead>
          <TableHead>大小</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* 返回上层 */}
        {!isLoading && data && !data.parentDirectory.isRoot && (
          <TableRow
            className="cursor-pointer"
            onClick={() => {
              setDirectoryId?.(data.parentDirectory.parentId)
            }}
          >
            <TableCell>
              <Undo2 size={18} />
            </TableCell>
            <TableCell className="tracking-widest select-none" colSpan={3}>
              ..
            </TableCell>
          </TableRow>
        )}
        {/* 加载状态 */}
        <DisplayByConditional condition={isLoading || isEmpty}>
          <TableRowLoading colSpan={4}>{isEmpty && '内容为空'}</TableRowLoading>
        </DisplayByConditional>
        {/* 文件夹 */}
        {data?.directories.map(directory => (
          <TableRow
            key={directory.id}
            className="cursor-pointer"
            onClick={() => {
              setDirectoryId?.(directory.id)
            }}
          >
            <TableCell>
              <Folder size={18} />
            </TableCell>
            <TableCell>{directory.name}</TableCell>
            <TableCell colSpan={2} />
          </TableRow>
        ))}
        {/* 文件 */}
        {data?.files.map(file => (
          <TableRow key={file.id}>
            <TableCell>
              <StorageFileIcon mimeType={file.mimeType} size={18} />
            </TableCell>
            <TableCell className="truncate">{[file.name, file.ext].filter(Boolean).join('.')}</TableCell>
            <TableCell>{formatFileSize(Number(file.size))}</TableCell>
            <TableCell className="space-x-2 text-right">
              <StorageFileLinkCopy file={file}>
                <TableActionButton>
                  <Link />
                </TableActionButton>
              </StorageFileLinkCopy>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TablePrimitive>
  )
}
