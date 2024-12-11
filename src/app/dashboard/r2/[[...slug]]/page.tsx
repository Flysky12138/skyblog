'use client'

import ModalDelete from '@/components/modal/ModalDelete'
import { Table } from '@/components/table'
import TableStatus from '@/components/table/TableStatus'
import { cn } from '@/lib/cn'
import { formatFileSize } from '@/lib/parser/size'
import { formatISOTime } from '@/lib/parser/time'
import { R2, R2FileInfoType } from '@/lib/server/r2'
import { Toast } from '@/lib/toast'
import { useImageViewerContext } from '@/provider/image-viewer'
import {
  AudioFileOutlined,
  DataObjectOutlined,
  Folder,
  FolderZipOutlined,
  FontDownloadOutlined,
  ImageOutlined,
  InsertDriveFileOutlined,
  TextSnippetOutlined,
  VideoCameraBackOutlined
} from '@mui/icons-material'
import { Button } from '@mui/joy'
import { produce } from 'immer'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'
import Breadcrumb from './_components/Breadcrumb'
import ModalCopy, { ModalCopyRef } from './_components/ModalCopy'
import UploadFiles from './_components/UploadFiles'

/** 文件图标 */
const FileIcon: React.FC<{ type?: string }> = ({ type = '' }) => {
  if (type.startsWith('image')) return <ImageOutlined />
  if (type.startsWith('audio')) return <AudioFileOutlined />
  if (type.startsWith('video')) return <VideoCameraBackOutlined />
  if (type.startsWith('font')) return <FontDownloadOutlined />
  if (type.startsWith('text')) return <TextSnippetOutlined />
  if (type.startsWith('application/json')) return <DataObjectOutlined />
  if (type.startsWith('application/zip')) return <FolderZipOutlined />
  return <InsertDriveFileOutlined />
}

export default function Page() {
  const router = useRouter()

  const { slug } = useParams<{ slug?: string[] }>()
  const path = slug?.length ? slug.join('/') : ''

  const { isLoading, data, mutate, error } = useSWR(`/r2/${path}`, () => R2.list(path ? `${decodeURIComponent(path)}/` : ''))

  const { openViewer } = useImageViewerContext()
  /** 文件点击 */
  const handleFileRowClick = React.useCallback<(file: R2FileInfoType) => void>(
    file => {
      if (!data) return
      if (file.contentType?.startsWith('image')) {
        const images = data.files.filter(it => it.contentType?.startsWith('image'))
        openViewer({
          images: images.map(image => ({ key: image.key, src: R2.get(image.key) })),
          index: Math.max(
            0,
            images.findIndex(image => image.key == file.key)
          )
        })
      }
    },
    [data, openViewer]
  )

  const copyLinkRef = React.useRef<ModalCopyRef>(null)

  return (
    <section>
      <Breadcrumb />
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-8 text-center align-middle">#</Table.Head>
            <Table.Head className="align-middle">名称</Table.Head>
            <Table.Head className="w-32 align-middle">大小</Table.Head>
            <Table.Head className="w-44 align-middle">时间</Table.Head>
            <Table.Head className="w-36 text-end align-middle">
              <UploadFiles
                component={props => (
                  <Button size="sm" variant="plain" {...props}>
                    上传
                  </Button>
                )}
                path={`/${path}`}
                onFinished={mutate}
              />
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body className={cn(['[&_tr]:cursor-pointer', 'hover:[&_tr]:bg-slate-100 hover:[&_tr]:dark:bg-[#292930]', 'hover:[&_tr]:text-sky-500'])}>
          {/* 返回上层 */}
          {slug?.length ? (
            <Table.Row onClick={() => router.replace(`/dashboard/r2/${slug.slice(0, -1).join('/')}`)}>
              <Table.Cell className="text-slate-500 dark:text-zinc-400">
                <Folder />
              </Table.Cell>
              <Table.Cell className="select-none tracking-widest" colSpan={4}>
                ..
              </Table.Cell>
            </Table.Row>
          ) : null}
          {/* 文件夹 */}
          {data?.folders.map(it => (
            <Table.Row key={it} onClick={() => router.replace(`/dashboard/r2/${it}`)}>
              <Table.Cell className="text-slate-500 dark:text-zinc-400">
                <Folder />
              </Table.Cell>
              <Table.Cell>{it.split('/').at(-2)}</Table.Cell>
              <Table.Cell colSpan={3}></Table.Cell>
            </Table.Row>
          ))}
          {/* 文件 */}
          {data?.files.map((it, index) => (
            <Table.Row key={it.key} onClick={() => handleFileRowClick(it)}>
              <Table.Cell className="text-slate-500 dark:text-zinc-400">
                <FileIcon type={it.contentType} />
              </Table.Cell>
              <Table.Cell className="truncate">{it.key.split('/').at(-1)}</Table.Cell>
              <Table.Cell>{formatFileSize(it.size)}</Table.Cell>
              <Table.Cell>{formatISOTime(it.lastModified)}</Table.Cell>
              <Table.Cell className="flex items-center justify-end">
                <Button
                  size="sm"
                  variant="plain"
                  onClick={event => {
                    event.stopPropagation()
                    copyLinkRef.current?.open([it])
                  }}
                >
                  直链
                </Button>
                <ModalDelete
                  component={props => (
                    <Button color="danger" size="sm" variant="plain" {...props}>
                      删除
                    </Button>
                  )}
                  description={it.key}
                  onSubmit={async () => {
                    await Toast(R2.delete([it.key]), { description: it.key, success: '删除成功' })
                    await mutate(
                      produce(state => {
                        state.files.splice(index, 1)
                      }),
                      { revalidate: false }
                    )
                  }}
                />
              </Table.Cell>
            </Table.Row>
          ))}
          <TableStatus colSpan={5} isEmpty={data?.folders.length == 0 && data.files.length == 0} isError={error} isLoading={isLoading} />
        </Table.Body>
      </Table>
      <ModalCopy ref={copyLinkRef} />
    </section>
  )
}
