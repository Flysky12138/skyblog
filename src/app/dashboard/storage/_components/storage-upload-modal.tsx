'use client'

import { Treaty } from '@elysiajs/eden'
import { limitAsync, remove, unionWith } from 'es-toolkit'
import { FileUp, FolderUp, Trash, Upload } from 'lucide-react'
import React from 'react'
import { useAsyncFn, useBeforeUnload } from 'react-use'
import { useImmer } from 'use-immer'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Table, TableActionButton } from '@/components/table'
import { LoadingButton } from '@/components/ui-overwrite/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { sha256 } from '@/lib/crypto'
import { getFileType, getImageSize, parseFileName } from '@/lib/file/info'
import { formatFileSize } from '@/lib/parser/size'
import { rpc, unwrap } from '@/lib/rpc'
import { toastPromise } from '@/lib/toast'
import { cn } from '@/lib/utils'

import { StorageFileIcon } from './storage-file-icon'
import { StorageTable2 } from './storage-table2'
import { PART_SIZE } from './utils'

interface FileEntry {
  id: string
  name: string
  path: string
  rawFile: File
  size: number
  type: string
}

interface StorageUploadModalProps extends React.PropsWithChildren {
  id: string
  /** 每个上传成功的文件都会调用 */
  onUploaded?: (payload: Treaty.Data<typeof rpc.dashboard.storage.files.post>) => void
}

export function StorageUploadModal({ children, id, onUploaded }: StorageUploadModalProps) {
  const [uploadPath, setUploadPath] = React.useState<string[]>([])

  const [filelist, setFilelist] = useImmer<{ uploaded: FileEntry[]; waiting: FileEntry[] }>({
    uploaded: [],
    waiting: []
  })

  const isUploadFinished = filelist.waiting.length == 0

  // 选择文件
  const onChange = React.useEffectEvent<React.ChangeEventHandler<HTMLInputElement>>(async event => {
    const files: FileEntry[] = await Array.fromAsync(event.target.files ?? [], async file => ({
      id: await sha256(file),
      name: file.name,
      path: file.webkitRelativePath || file.name,
      rawFile: file,
      size: file.size,
      type: file.type
    }))

    setFilelist(draft => {
      draft.waiting = unionWith(draft.waiting, files, (a, b) => a.id == b.id && a.path == b.path)
    })

    event.target.value = ''
  })

  // 上传文件
  const uploadFile = React.useEffectEvent(async (file: FileEntry) => {
    const promise = async () => {
      // 初始化
      const { uploadId } = await rpc.dashboard.storage.objects['multipart-upload'].create.post({ contentType: file.type, key: file.id }).then(unwrap)
      // 分片上传
      const partUpload = async (index: number) => {
        const partNumber = index + 1
        const { url } = await rpc.dashboard.storage.objects['multipart-upload']['sign-part'].post({ key: file.id, partNumber, uploadId }).then(unwrap)
        const res = await fetch(url, {
          body: file.rawFile.slice(index * PART_SIZE, (index + 1) * PART_SIZE),
          method: 'PUT'
        })
        if (!res.ok) {
          throw new Error(`Part ${partNumber} upload failed`)
        }
        return {
          ETag: res.headers.get('ETag') ?? undefined,
          PartNumber: partNumber
        }
      }
      const limit = limitAsync(partUpload, 5)
      const parts = await Promise.all(Array.from({ length: Math.ceil(file.size / PART_SIZE) }, (_, index) => limit(index)))
      // 完成上传
      const { Bucket } = await rpc.dashboard.storage.objects['multipart-upload'].complete.post({ key: file.id, parts, uploadId }).then(unwrap)
      // 获取文件信息
      const metadata = {
        ...(getFileType(file.type) == 'image' ? await getImageSize(file.rawFile) : {})
      }
      const { ext, name } = parseFileName(file.name)
      // 保存记录到数据库
      return rpc.dashboard.storage.files
        .post({
          directory: { id, names: [...uploadPath, ...file.path.split('/').filter(Boolean).slice(0, -1)] },
          file: { ext, metadata, mimeType: file.type, name, size: file.size },
          s3Object: { bucket: Bucket!, objectKey: file.id }
        })
        .then(unwrap)
    }

    const data = await toastPromise(promise(), {
      description: file.path,
      success: '上传成功',
      error: e => e.message
    })

    setFilelist(draft => {
      draft.uploaded.push(file)
      remove(draft.waiting, item => item.id == file.id && item.path == file.path)
    })

    onUploaded?.(data)
  })

  // 上传
  const [{ loading: isUploading }, handleUpload] = useAsyncFn(async () => {
    const limit = limitAsync(uploadFile, 3)
    return Promise.allSettled(Array.from(filelist.waiting, limit))
  }, [filelist, uploadPath, onUploaded])

  useBeforeUnload(isUploading, '正在上传中，不要关闭窗口')

  return (
    <Dialog
      onOpenChange={open => {
        if (!open) return
        if (isUploadFinished) {
          setUploadPath([])
          setFilelist({ uploaded: [], waiting: [] })
        }
      }}
    >
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
          <DialogTitle>文件上传</DialogTitle>
          <DialogDescription>上传文件或文件夹内所有文件到 Cloudflare 的 R2 对象存储</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 not-sm:flex-wrap">
          <InputGroup aria-disabled={isUploading}>
            <InputGroupInput
              autoComplete="off"
              disabled={isUploading}
              onChange={event => {
                const { value } = event.target
                setUploadPath(value.split('/').filter(Boolean))
              }}
            />
            <DisplayByConditional condition={uploadPath.length > 0}>
              <InputGroupAddon>
                <InputGroupText>{uploadPath.join('/')}</InputGroupText>
              </InputGroupAddon>
            </DisplayByConditional>
          </InputGroup>
          <ButtonGroup className="not-sm:ml-auto">
            <Button asChild>
              <label role="button" tabIndex={0}>
                <FileUp strokeWidth={3} />
                选择文件
                <input hidden multiple type="file" onChange={onChange} />
              </label>
            </Button>
            <ButtonGroupSeparator />
            <Button asChild>
              <label role="button" tabIndex={0}>
                <FolderUp strokeWidth={3} />
                选择文件夹
                <input hidden multiple directory="true" type="file" webkitdirectory="true" onChange={onChange} />
              </label>
            </Button>
          </ButtonGroup>
          <LoadingButton
            className={cn('grow', {
              hidden: isUploadFinished
            })}
            icon={<Upload />}
            loading={isUploading}
            onClick={handleUpload}
          >
            上传
          </LoadingButton>
        </div>

        <Tabs defaultValue="waiting">
          <TabsList className="grid w-full grid-cols-2 sm:w-60">
            <TabsTrigger value="waiting">待上传 {filelist.waiting.length || undefined}</TabsTrigger>
            <TabsTrigger value="uploaded">已上传</TabsTrigger>
          </TabsList>
          <TabsContent value="waiting">
            <Table
              columns={[
                {
                  key: 'icon',
                  width: 42,
                  render: file => <StorageFileIcon mimeType={file.type} size={18} />
                },
                {
                  dataIndex: 'path',
                  title: '路径',
                  width: 250,
                  widthFit: true
                },
                { dataIndex: 'size', render: formatFileSize, title: '大小', width: 120 },
                {
                  align: 'right',
                  key: 'action',
                  title: '操作',
                  width: 80,
                  render: (_, index) => (
                    <TableActionButton
                      disabled={isUploading}
                      variant="destructive"
                      onClick={() => {
                        setFilelist(draft => {
                          draft.waiting.splice(index, 1)
                        })
                      }}
                    >
                      <Trash />
                    </TableActionButton>
                  )
                }
              ]}
              dataSource={filelist.waiting}
              rowClassName={file => ({
                hidden: filelist.uploaded.includes(file)
              })}
              rowKey={file => `${file.id}_${file.path}`}
            />
          </TabsContent>
          <TabsContent value="uploaded">
            <StorageTable2 id={id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
