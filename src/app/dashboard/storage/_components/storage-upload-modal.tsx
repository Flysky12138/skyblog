'use client'

import { Treaty } from '@elysiajs/eden'
import { limitAsync, remove, unionWith } from 'es-toolkit'
import { FileUp, FolderUp, Trash, Upload } from 'lucide-react'
import React from 'react'
import { useAsyncFn, useBeforeUnload } from 'react-use'
import { useImmer } from 'use-immer'

import { DataTableWrapper } from '@/components/data-table'
import { DataTableRowActionButton } from '@/components/data-table/data-table-action'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Button } from '@/components/ui-overwrite/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { sha256 } from '@/lib/crypto'
import { getFileType, getImageSize, parseFileName } from '@/lib/file/info'
import { rpc, unwrap } from '@/lib/http/rpc'
import { formatFileSize } from '@/lib/parser/size'
import { toastPromise, toastPromiseDelay } from '@/lib/toast'
import { cn } from '@/lib/utils'

import { StorageFileIcon } from './storage-file-icon'
import { StorageTable2 } from './storage-table2'
import { chunkUpload } from './utils'

interface FileEntry {
  /** 文件 sha256 */
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
    const files: FileEntry[] = await toastPromiseDelay(
      Array.fromAsync(event.target.files ?? [], async file => ({
        id: await sha256(file),
        name: file.name,
        path: file.webkitRelativePath || file.name,
        rawFile: file,
        size: file.size,
        type: file.type
      })),
      {
        loading: '正在计算文件 SHA256'
      },
      200
    )

    setFilelist(draft => {
      draft.waiting = unionWith(draft.waiting, files, (a, b) => a.id == b.id && a.path == b.path)
    })

    event.target.value = ''
  })

  // 上传文件
  const uploadFile = React.useEffectEvent(async (file: FileEntry) => {
    const promise = async () => {
      const objectDetail = await rpc.dashboard.storage.objects({ id: file.id }).get().then(unwrap)
      const bucket = objectDetail?.bucket || (await chunkUpload({ file: file.rawFile, id: file.id, type: file.type }))
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
          s3Object: { bucket, objectKey: file.id }
        })
        .then(unwrap)
    }

    const data = await toastPromise(promise(), {
      description: file.path,
      loading: '正在上传',
      success: '上传成功'
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
      <DialogContent className="max-w-5xl">
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
          <ButtonGroup aria-disabled={isUploading} className="not-sm:ml-auto">
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
          <Button
            className={cn('grow', {
              hidden: isUploadFinished
            })}
            loading={isUploading}
            onClick={handleUpload}
          >
            <Upload /> 上传
          </Button>
        </div>

        <Tabs defaultValue="waiting">
          <TabsList className="grid w-full grid-cols-2 sm:w-60">
            <TabsTrigger value="waiting">待上传 {filelist.waiting.length || undefined}</TabsTrigger>
            <TabsTrigger value="uploaded">已上传</TabsTrigger>
          </TabsList>
          <TabsContent value="waiting">
            <DataTableWrapper>
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
                  {filelist.waiting.length ? (
                    filelist.waiting.map((file, index) => (
                      <TableRow
                        key={`${file.id}_${file.path}`}
                        className={cn({
                          hidden: filelist.uploaded.includes(file)
                        })}
                      >
                        <TableCell>
                          <StorageFileIcon mimeType={file.type} size={18} />
                        </TableCell>
                        <TableCell>{file.path}</TableCell>
                        <TableCell>{formatFileSize(file.size)}</TableCell>
                        <TableCell className="text-right">
                          <DataTableRowActionButton
                            disabled={isUploading}
                            variant="destructive"
                            onClick={() => {
                              setFilelist(draft => {
                                draft.waiting.splice(index, 1)
                              })
                            }}
                          >
                            <Trash />
                          </DataTableRowActionButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="font-title cursor-default text-center" colSpan={4}>
                        未添加文件
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DataTableWrapper>
          </TabsContent>
          <TabsContent value="uploaded">
            <StorageTable2 id={id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
