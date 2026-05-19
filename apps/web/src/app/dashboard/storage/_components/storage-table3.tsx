'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'
import { TrashIcon } from 'lucide-react'

import { DataTableWrapper } from '@/components/data-table'
import { DataTableRowActionButton } from '@/components/data-table/data-table-action'
import { FileHelper } from '@/lib/helper/file'

import { StorageFileIcon } from './storage-file-icon'
import { FileEntry } from './storage-upload-modal'

interface StorageTable3Props {
  className?: string
  data: FileEntry[]
  isUploading: boolean
  onDelete?: (file: FileEntry, index: number) => void
}

export function StorageTable3({ className, data, isUploading, onDelete }: StorageTable3Props) {
  return (
    <DataTableWrapper className={className}>
      <Table>
        <colgroup>
          <col width="42" />
          <col style={{ minWidth: 250, width: 'fit-content' }} />
          <col width="120" />
          <col width="80" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>路径</TableHead>
            <TableHead>大小</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((file, index) => (
              <TableRow key={`${file.id}:${file.path}`}>
                <TableCell>
                  <StorageFileIcon mimeType={file.type} size={18} />
                </TableCell>
                <TableCell>{file.path}</TableCell>
                <TableCell>{FileHelper.formatFileSize(file.size)}</TableCell>
                <TableCell className="text-right">
                  <DataTableRowActionButton
                    disabled={isUploading}
                    variant="destructive"
                    onClick={() => {
                      onDelete?.(file, index)
                    }}
                  >
                    <TrashIcon />
                  </DataTableRowActionButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="cursor-default text-center font-heading" colSpan={4}>
                未添加文件
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DataTableWrapper>
  )
}
