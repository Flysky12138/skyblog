'use client'

import { Treaty } from '@elysiajs/eden'
import { FileSelect } from '@repo/ui/components-self/file-select'
import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs'
import { difference, limitAsync, remove, unionWith } from 'es-toolkit'
import { FileIcon, FolderIcon, TrashIcon, UploadIcon } from 'lucide-react'
import React from 'react'
import { useAsyncFn, useBeforeUnload } from 'react-use'
import { useImmer } from 'use-immer'

import { FileHelper } from '@/lib/helper/file'
import { rpc } from '@/lib/http/rpc'
import { Storage } from '@/lib/http/storage'
import { toastPromise, toastPromiseDelay } from '@/lib/toast'

import { StorageTable2 } from './storage-table2'
import { StorageTable3 } from './storage-table3'

export interface FileEntry {
  /**
   * 文件 sha256
   */
  id: string
  name: string
  path: string
  rawFile: File
  size: number
  type: string
}

interface StorageUploadModalProps {
  children: React.ReactElement
  /**
   * 父文件夹 ID
   */
  id: string
  /**
   * 每个上传成功的文件都会调用
   */
  onUploaded?: (payload: Treaty.Data<typeof rpc.dashboard.storage.files.post>) => Promise<void>
}

export function StorageUploadModal({ children, id, onUploaded }: StorageUploadModalProps) {
  const [activeTab, setActiveTab] = React.useState<'select' | 'uploaded' | 'waiting'>('select')
  const [filelist, setFilelist] = useImmer<{ uploaded: FileEntry[]; waiting: FileEntry[] }>({
    uploaded: [],
    waiting: []
  })

  const isUploadFinished = filelist.waiting.length === 0

  if (isUploadFinished && activeTab === 'waiting') {
    setActiveTab('select')
  }

  // 选择文件
  const onChange = async (files: File[]) => {
    try {
      const getFileInfo = async (file: File) => ({
        id: await FileHelper.getFileHash(file),
        name: file.name,
        path: file.webkitRelativePath || file.name,
        rawFile: file,
        size: file.size,
        type: file.type
      })
      const limit = limitAsync(getFileInfo, 10)

      const fileEntries: FileEntry[] = await toastPromiseDelay(
        Promise.all(files.map(limit)),
        {
          error: '文件 SHA256 计算失败',
          loading: '正在计算文件 SHA256'
        },
        200
      )

      setFilelist(draft => {
        draft.waiting = unionWith(draft.waiting, fileEntries, (a, b) => a.id === b.id && a.path === b.path)
      })

      setActiveTab('waiting')
    } catch (error) {
      console.error(error)
    }
  }

  // 上传文件
  const [{ loading: isUploading }, handleUpload] = useAsyncFn(async () => {
    const promise = async (file: FileEntry) => {
      const data = await toastPromise(
        Storage.uploadFile({
          file: file.rawFile,
          s3ObjectKey: file.id,
          directory: {
            id,
            names: file.path.split('/').filter(Boolean).slice(0, -1)
          }
        }),
        {
          description: file.path,
          loading: '正在上传',
          success: '上传成功'
        }
      )

      setFilelist(draft => {
        draft.uploaded.push(file)
        remove(draft.waiting, item => item.id === file.id && item.path === file.path)
      })

      await onUploaded?.(data)
    }
    const limit = limitAsync(promise, 3)

    return Promise.allSettled(filelist.waiting.map(limit))
  }, [filelist, onUploaded])

  useBeforeUnload(isUploading, '正在上传中，不要关闭窗口')

  return (
    <Dialog
      onOpenChange={newOpen => {
        if (!newOpen) return
        if (isUploadFinished) {
          setFilelist({ uploaded: [], waiting: [] })
        }
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>文件上传</DialogTitle>
          <DialogDescription>上传文件或文件夹内所有文件到 Cloudflare 的 R2 对象存储</DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 sm:w-80">
            <TabsTrigger value="select">选择文件</TabsTrigger>
            <TabsTrigger disabled={isUploadFinished} value="waiting">
              待上传 {filelist.waiting.length || undefined}
            </TabsTrigger>
            <TabsTrigger value="uploaded">已上传</TabsTrigger>
          </TabsList>

          <TabsContent value="select">
            <div className="grid gap-2 sm:grid-cols-2">
              <FileSelect
                multiple
                logo={FileIcon}
                title="选择文件"
                onChange={event => {
                  void onChange(event)
                }}
              />
              <FileSelect
                multiple
                logo={FolderIcon}
                title="选择文件夹"
                type="folder"
                onChange={event => {
                  void onChange(event)
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="waiting">
            <div className="flex flex-col gap-2">
              {!isUploadFinished && (
                <div className="ml-auto flex gap-2">
                  <Button
                    disabled={isUploading}
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setFilelist(draft => {
                        draft.waiting = []
                      })
                    }}
                  >
                    <TrashIcon /> 清空
                  </Button>
                  <Button
                    loading={isUploading}
                    size="sm"
                    onClick={() => {
                      void handleUpload()
                    }}
                  >
                    <UploadIcon /> 开始上传
                  </Button>
                </div>
              )}
              <StorageTable3
                data={difference(filelist.waiting, filelist.uploaded)}
                isUploading={isUploading}
                onDelete={(file, index) => {
                  setFilelist(draft => {
                    draft.waiting.splice(index, 1)
                  })
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="uploaded">
            <StorageTable2 id={id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
