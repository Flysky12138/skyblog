import ModalCore, { ModalCoreProps } from '@/components/modal/ModalCore'
import TableStatus from '@/components/table/TableStatus'
import TableWrapper from '@/components/table/TableWrapper'
import { cn } from '@/lib/cn'
import { getImageSize } from '@/lib/file/info'
import { convertObjectValues } from '@/lib/parser/object'
import { formatFileSize } from '@/lib/parser/size'
import { promisePool } from '@/lib/promise'
import { R2 } from '@/lib/server/r2'
import { Toast } from '@/lib/toast'
import { FileOpenOutlined, FileUploadOutlined, FolderOpenOutlined } from '@mui/icons-material'
import { Button, ButtonGroup, Input, Table } from '@mui/joy'
import React from 'react'
import { useBeforeUnload } from 'react-use'
import { useImmer } from 'use-immer'
import CopyLink, { ModalCopyRef } from './ModalCopy'

interface UploadFilesProps extends Pick<ModalCoreProps, 'component'> {
  onFinished?: () => void
  onSubmit?: (payload: UnwrapPromise<ReturnType<typeof R2.put>>) => void
  path: StartsWith<'/'>
}

export default function UploadFiles({ component: Component, path, onSubmit, onFinished }: UploadFilesProps) {
  const [fileList, setFileList] = useImmer<File[]>([])
  const [uploadFinishedFileList, setUploadFinishedFileList] = useImmer<File[]>([])
  const [uploadFinishedReturnData, setUploadFinishedReturnData] = useImmer<UnwrapPromise<ReturnType<typeof R2.put>>[]>([])

  const isUploadFinished = fileList.length <= uploadFinishedFileList.length

  const [isUploading, setIsUploading] = React.useState(false)
  useBeforeUnload(isUploading, '正在上传中，不要关闭窗口')

  const [basePath, setBasePath] = React.useState('')
  const checkBasePathValidity = React.useMemo(() => {
    if (!basePath.startsWith('/')) return false
    if (!basePath.endsWith('/')) return false
    return true
  }, [basePath])

  const copyLinkRef = React.useRef<ModalCopyRef>(null)

  const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setFileList(Array.from(event.target.files || []))
  }

  const upload = async () => {
    setIsUploading(true)
    await promisePool(
      fileList.map(file => async () => {
        if (uploadFinishedFileList.includes(file)) return
        const path = file.webkitRelativePath || file.name
        const Metadata = {}
        if (file.type.startsWith('image')) {
          const imageSize = await getImageSize(file)
          Object.assign(
            Metadata,
            convertObjectValues(imageSize, {
              height: it => String(it),
              width: it => String(it)
            })
          )
        }
        const data = await Toast(R2.put({ Metadata, Body: file, ContentType: file.type, Key: basePath.slice(1) + path }), {
          description: path,
          success: '上传成功'
        })
        setUploadFinishedFileList(state => {
          state.push(file)
        })
        setUploadFinishedReturnData(state => {
          state.push(data)
        })
        onSubmit?.(data)
      })
    )
    onFinished?.()
    setIsUploading(false)
  }

  return (
    <ModalCore
      component={Component}
      onClose={() => {
        if (!isUploadFinished) return
        setFileList([])
        setUploadFinishedFileList([])
        setUploadFinishedReturnData([])
      }}
      onOpen={() => setBasePath(decodeURIComponent(path))}
    >
      <div className="flex gap-x-5">
        <Input className="grow" disabled={isUploading} value={basePath} onChange={event => setBasePath(event.target.value.replace(/\/{2,}/g, '/') || '/')} />
        {uploadFinishedReturnData.length > 0 && (
          <Button variant="soft" onClick={() => copyLinkRef.current?.open(uploadFinishedReturnData)}>
            已上传
          </Button>
        )}
        {isUploadFinished ? (
          <ButtonGroup
            color="primary"
            size="sm"
            variant="solid"
            onClick={() => {
              setFileList([])
              setUploadFinishedFileList([])
            }}
          >
            <Button component="label" startDecorator={<FileOpenOutlined />}>
              选择文件
              <input hidden multiple type="file" onChange={onChange} />
            </Button>
            <Button component="label" startDecorator={<FolderOpenOutlined />}>
              选择文件夹
              <input hidden multiple directory="true" type="file" webkitdirectory="true" onChange={onChange} />
            </Button>
          </ButtonGroup>
        ) : (
          <Button color="success" disabled={!checkBasePathValidity || isUploading} size="sm" startDecorator={<FileUploadOutlined />} onClick={upload}>
            上传（{fileList.length - uploadFinishedFileList.length}）
          </Button>
        )}
      </div>
      <TableWrapper className="mt-3 max-w-screen-md">
        <Table>
          <thead>
            <tr>
              <th>路径</th>
              <th className="w-32">大小</th>
              <th className="w-20 pr-5 text-end">操作</th>
            </tr>
          </thead>
          <tbody>
            {fileList.map((file, index) => (
              <tr
                key={file.webkitRelativePath || file.name}
                className={cn({
                  hidden: uploadFinishedFileList.includes(file)
                })}
              >
                <td>
                  <span className="block truncate" title={file.webkitRelativePath || file.name}>
                    {file.webkitRelativePath || file.name}
                  </span>
                </td>
                <td>{formatFileSize(file.size)}</td>
                <td className="text-end">
                  <Button
                    color="danger"
                    disabled={isUploading}
                    size="sm"
                    variant="plain"
                    onClick={() => {
                      setFileList(state => {
                        state.splice(index, 1)
                      })
                    }}
                  >
                    删除
                  </Button>
                </td>
              </tr>
            ))}
            <TableStatus colSpan={3} isEmpty={fileList.length == 0 || isUploadFinished} isLoading={false} />
          </tbody>
        </Table>
      </TableWrapper>
      <CopyLink ref={copyLinkRef} />
    </ModalCore>
  )
}
