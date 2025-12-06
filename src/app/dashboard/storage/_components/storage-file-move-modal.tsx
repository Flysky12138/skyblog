'use client'

import { remove } from 'es-toolkit'
import { produce } from 'immer'
import { Redo } from 'lucide-react'
import pLimit from 'p-limit'
import React from 'react'
import { useAsyncFn } from 'react-use'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { Table } from '@/components/table'
import { Button } from '@/components/ui-overwrite/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Input } from '@/components/ui/input'
import { formatFileSize } from '@/lib/parser/size'
import { toastPromise } from '@/lib/toast'
import { S3Service } from '@/server'

import { StorageFileIcon } from './storage-file-icon'
import { STORAGE_LIST_SWR_KEY } from './storage-table'

interface StorageFileMoveModalProps extends React.PropsWithChildren {
  id: string
}

export function StorageFileMoveModal({ children, id }: StorageFileMoveModalProps) {
  const [movePath, setMovePath] = React.useState(path)
  const [section, setSection] = useImmer<S3.FileInfo[]>([])

  // 检测 movePath 是否合法
  const isValidMovePath = React.useMemo(() => {
    if (!movePath.startsWith('/')) return false
    if (!movePath.endsWith('/')) return false
    return true
  }, [movePath])

  const { data, isLoading, mutate } = useSWR(STORAGE_LIST_SWR_KEY(path), () => {
    return S3Service.list(path == '/' ? '' : path.slice(1))
  })

  const [{ loading: isMoving }, handleMove] = useAsyncFn(async () => {
    const limit = pLimit(5)

    return Promise.allSettled(
      Array.from(section).map(async file => {
        return limit(async () => {
          const to = `${movePath}${file.key.split('/').pop()}`.slice(1)
          await toastPromise(S3Service.move({ from: file.key, to }), {
            description: to,
            success: '移动成功'
          })
          await mutate(
            produce<typeof data>(draft => {
              remove(draft?.files || [], item => item.key == file.key)
            }),
            {
              revalidate: false
            }
          )
          setSection(draft => {
            remove(draft, item => item.key == file.key)
          })
        })
      })
    )
  }, [movePath, section])

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-5xl"
        onCloseAutoFocus={event => {
          event.preventDefault()
        }}
        onOpenAutoFocus={event => {
          event.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>文件移动</DialogTitle>
          <DialogDescription>请选择要移动的文件</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            aria-invalid={!isValidMovePath}
            autoComplete="off"
            disabled={isMoving}
            value={movePath}
            onChange={event => {
              setMovePath((event.target.value.replace(/\/{2,}/g, '/') as StorageFileMoveModalProps['path']) || '/')
            }}
          />
          <Button disabled={!isValidMovePath} loading={isMoving} onClick={handleMove}>
            <Redo /> 移动
          </Button>
        </div>

        <Table
          columns={[
            { key: 'section' },
            {
              key: 'icon',
              width: 42,
              render: file => <StorageFileIcon mimeType={file} size={18} />
            },
            {
              key: 'name',
              title: '名称',
              width: 250,
              widthFit: true,
              render: file => file.key.split('/').pop()
            },
            { dataIndex: 'size', render: formatFileSize, title: '大小', width: 120 }
          ]}
          dataSource={data?.files}
          loading={isLoading}
          rowKey="key"
          rowSelection={{
            selectedRows: section,
            onChange: setSection
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
