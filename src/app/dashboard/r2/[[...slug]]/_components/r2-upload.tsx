'use client'

import { remove, unionBy } from 'es-toolkit'
import { FileUp, FolderUp, Trash, Upload } from 'lucide-react'
import React from 'react'
import { useAsyncFn, useBeforeUnload } from 'react-use'
import { useImmer } from 'use-immer'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Table, TableActionButton } from '@/components/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getImageSize } from '@/lib/file/info'
import { convertObjectValues } from '@/lib/parser/object'
import { formatFileSize } from '@/lib/parser/size'
import { promiseAllSettledPool } from '@/lib/promise'
import { toastPromise } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { S3Service } from '@/server'

import { R2Table } from './r2-table'

interface R2UploadProps extends React.PropsWithChildren {
  path: FilePathType
  onFinished?: () => void
  /** 每个上传成功的文件都会调用 */
  onSubmit?: (payload: S3.FileInfo) => void
}

export const R2Upload = ({ children, path, onFinished, onSubmit }: R2UploadProps) => {
  const [basePath, setBasePath] = React.useState<R2UploadProps['path']>('/')

  /** 检测 basePath 是否合法 */
  const basePathIsValid = React.useMemo(() => {
    if (!basePath.startsWith('/')) {
      return false
    }
    if (!basePath.endsWith('/')) {
      return false
    }
    return true
  }, [basePath])

  const [filelist, setFilelist] = useImmer<{ uploaded: File[]; waiting: File[] }>({
    uploaded: [],
    waiting: []
  })

  const isUploadFinished = filelist.waiting.length == 0

  const onChange = React.useEffectEvent<React.ChangeEventHandler<HTMLInputElement>>(event => {
    setFilelist(draft => {
      draft.waiting = unionBy(draft.waiting, Array.from(event.target.files || []), getFileName)
    })
    event.target.value = ''
  })

  const [{ loading: isUploading }, handleUpload] = useAsyncFn(async () => {
    return promiseAllSettledPool(
      Array.from(filelist.waiting).map(file => async () => {
        const metadata = {}
        if (file.type.startsWith('image')) {
          const imageSize = await getImageSize(file)
          Object.assign(metadata, convertObjectValues(imageSize, { height: String, width: String }))
        }
        const filename = getFileName(file)
        const data = await toastPromise(
          S3Service.put({
            body: file,
            contentType: file.type,
            key: `${basePath}${filename}`.slice(1),
            metadata
          }),
          {
            description: filename,
            success: '上传成功',
            error: e => e.message
          }
        )
        setFilelist(draft => {
          draft.uploaded.push(file)
          remove(draft.waiting, item => item == file)
        })
        onSubmit?.(data)
      })
    )
  }, [filelist, onSubmit])

  useBeforeUnload(isUploading, '正在上传中，不要关闭窗口')

  return (
    <Dialog
      onOpenChange={open => {
        if (open) {
          setBasePath(decodeURIComponent(path) as R2UploadProps['path'])
        } else if (isUploadFinished) {
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
        <ButtonGroup className="w-full">
          <ButtonGroup className="w-full">
            <Input
              aria-invalid={!basePathIsValid}
              disabled={isUploading}
              value={basePath}
              onChange={event => {
                setBasePath((event.target.value.replace(/\/{2,}/g, '/') as R2UploadProps['path']) || '/')
              }}
            />
          </ButtonGroup>
          <ButtonGroup>
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
        </ButtonGroup>
        <Tabs defaultValue="waiting">
          <div className="flex justify-between">
            <TabsList className="grid w-60 grid-cols-2">
              <TabsTrigger value="waiting">待上传</TabsTrigger>
              <TabsTrigger value="uploaded">已上传</TabsTrigger>
            </TabsList>
            <Button
              className={cn({
                hidden: isUploadFinished
              })}
              disabled={!basePathIsValid || isUploading}
              onClick={async () => {
                await handleUpload()
                onFinished?.()
              }}
            >
              <DisplayByConditional condition={isUploading} fallback={<Upload />}>
                <Spinner />
              </DisplayByConditional>
              上传
            </Button>
          </div>
          <TabsContent value="waiting">
            <Table
              columns={[
                {
                  key: 'path',
                  title: '路径',
                  render: file => (
                    <span className="block truncate" title={getFileName(file)}>
                      {getFileName(file)}
                    </span>
                  )
                },
                { dataIndex: 'size', headerClassName: 'w-28', render: formatFileSize, title: '大小' },
                {
                  align: 'right',
                  headerClassName: 'w-12',
                  key: 'action',
                  title: '操作',
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
              rowKey={getFileName}
            />
          </TabsContent>
          <TabsContent value="uploaded">
            <R2Table
              hiddenParentDirectoryRow
              hiddenUploadButton
              className="**:[tr]:cursor-auto"
              // 验证失败使用默认值
              paths={(basePathIsValid ? basePath : decodeURIComponent(path)).split('/').filter(Boolean)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

const getFileName = (file: File) => file.webkitRelativePath || file.name
