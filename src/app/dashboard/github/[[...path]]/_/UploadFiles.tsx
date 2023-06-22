import ModalCore, { ModalCoreRef } from '@/components/modal/ModalCore'
import { cn } from '@/lib/cn'
import { formatFileSize } from '@/lib/parser/size'
import { putGithubRepos } from '@/lib/server/github'
import { CustomToast } from '@/lib/toast'
import { FileOpenOutlined, FileUploadOutlined } from '@mui/icons-material'
import { Button, Input, Table } from '@mui/joy'
import React from 'react'
import { useBeforeUnload } from 'react-use'
import { useImmer } from 'use-immer'
import CopyLink, { CopyLinkRef } from './CopyLink'

interface UploadFilesPropsType {
  component: React.FunctionComponent<{
    onClick: React.MouseEventHandler<HTMLElement>
  }>
  isUploadDirectory?: boolean
  onSubmit?: (payload: GithubRepoFileType) => Promise<void>
  path: string
}

export default function UploadFiles({ component: Component, isUploadDirectory, path, onSubmit }: UploadFilesPropsType) {
  const modalRef = React.useRef<ModalCoreRef>()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [fileList, setFileList] = useImmer<File[]>([])
  const [uploadFinishedFileList, setUploadFinishedFileList] = useImmer<File[]>([])
  const [uploadFinishedReturnData, setUploadFinishedReturnData] = useImmer<GithubRepoFileType[]>([])
  const isUploadFinished = fileList.length <= uploadFinishedFileList.length

  const [basePath, setBasePath] = React.useState('')
  const checkBasePathValidity = React.useMemo(() => {
    if (!basePath.startsWith('/')) return false
    if (!basePath.endsWith('/')) return false
    return true
  }, [basePath])

  const [isUploading, setIsUploading] = React.useState(false)
  useBeforeUnload(isUploading, '正在上传中，不要关闭窗口')

  const copyLinkRef = React.useRef<CopyLinkRef>(null)

  return (
    <section>
      <Component
        onClick={() => {
          fileList.length > 0 ? modalRef.current?.openToggle(true) : inputRef.current?.click()
        }}
      />
      <input
        ref={inputRef}
        multiple
        className="hidden"
        type="file"
        {...(isUploadDirectory && {
          directory: 'true',
          webkitdirectory: 'true'
        })}
        onInput={event => {
          const target = event.target as HTMLInputElement
          setFileList(Array.from(target.files || []))
          target.value = ''
          modalRef.current?.openToggle(true)
        }}
      />
      <ModalCore
        ref={modalRef}
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
            <Button
              color="warning"
              size="sm"
              startDecorator={<FileOpenOutlined />}
              onClick={() => {
                setFileList([])
                setUploadFinishedFileList([])
                inputRef.current?.click()
              }}
            >
              重新选择
            </Button>
          ) : (
            <Button
              color="success"
              disabled={!checkBasePathValidity || isUploading}
              size="sm"
              startDecorator={<FileUploadOutlined />}
              onClick={async () => {
                setIsUploading(true)
                for (const file of fileList) {
                  try {
                    if (uploadFinishedFileList.includes(file)) continue
                    const path = basePath.slice(1) + (file.webkitRelativePath || file.name)
                    const data = await CustomToast(putGithubRepos(path, file), '上传成功', path)
                    setUploadFinishedFileList(state => {
                      state.push(file)
                    })
                    setUploadFinishedReturnData(state => {
                      state.push(data)
                    })
                    await onSubmit?.(data)
                  } catch (error) {}
                }
                setIsUploading(false)
              }}
            >
              上传（{fileList.length - uploadFinishedFileList.length}）
            </Button>
          )}
        </div>
        <Table className="mt-3 max-w-screen-md">
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
          </tbody>
        </Table>
        <CopyLink ref={copyLinkRef} />
      </ModalCore>
    </section>
  )
}
