'use client'

import Card from '@/components/layout/Card'
import ModalDelete from '@/components/modal/ModalDelete'
import TableStatus from '@/components/table/TableStatus'
import TableWrapper from '@/components/table/TableWrapper'
import { cn } from '@/lib/cn'
import { formatFileSize } from '@/lib/parser/size'
import { formatISOTime } from '@/lib/parser/time'
import { R2 } from '@/lib/server/r2'
import { ImageViewerContext } from '@/provider/image-viewer'
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
import { Button, Table } from '@mui/joy'
import { produce } from 'immer'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'
import { CopyLinkRef } from '../_components/CopyLink'

/** 文件图标 */
const FileIcon: React.FC<{ type: string }> = ({ type }) => {
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
  const { isLoading, data, mutate } = useSWR(`/r2/${path}`, () => R2.list(path + '/'))

  const { openViewer } = React.useContext(ImageViewerContext)

  const copyLinkRef = React.useRef<CopyLinkRef>(null)

  return (
    <Card>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th className="w-8 text-center">#</th>
              <th>名称</th>
              <th className="w-32">大小</th>
              <th className="w-44">时间</th>
              <th className="w-36"></th>
            </tr>
          </thead>
          <tbody className={cn(['[&_tr]:cursor-pointer', 'hover:[&_tr]:bg-slate-100 hover:[&_tr]:dark:bg-[#292930]'])}>
            {slug?.length ? (
              <tr onClick={() => router.replace(`/dashboard/r2/${slug.slice(0, -1).join('/')}`)}>
                <td></td>
                <td className="select-none" colSpan={4}>
                  ..
                </td>
              </tr>
            ) : null}
            {/* 文件夹 */}
            {data?.delimitedPrefixes.map(it => (
              <tr key={it} onClick={() => router.replace(`/dashboard/r2/${it}`)}>
                <td className="text-slate-500 dark:text-zinc-400">
                  <Folder />
                </td>
                <td>{it.split('/').at(-2)}</td>
                <td colSpan={3}></td>
              </tr>
            ))}
            {/* 文件 */}
            {data?.objects.map((it, index) => (
              <tr
                key={it.key}
                onClick={() => {
                  // if (file.type == 'dir') router.replace(`${pathname}?path=${paths.concat(file.name).join('/')}`)
                  // else if (EXT.IMAGE.some(ext => file.name.endsWith(ext))) {
                  //   const images = data.filter(f => EXT.IMAGE.some(ext => f.name.endsWith(ext)))
                  //   openViewer({
                  //     images: images.map(image => ({ key: image.sha, src: githubFileDirectUrl(image.path) })),
                  //     index: Math.max(
                  //       0,
                  //       images.findIndex(image => image.sha == file.sha)
                  //     )
                  //   })
                  // }
                }}
              >
                <td className="text-slate-500 dark:text-zinc-400">
                  <FileIcon type={it.httpMetadata?.contentType || ''} />
                </td>
                <td className="truncate">{it.key.split('/').at(-1)}</td>
                <td>{formatFileSize(it.size)}</td>
                <td>{formatISOTime(it.uploaded)}</td>
                <td className="flex items-center justify-end">
                  <Button
                    variant="plain"
                    onClick={event => {
                      // event.stopPropagation()
                      // copyLinkRef.current?.open([file])
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
                    title="删除？"
                    onSubmit={async () => {
                      // await Toast(1, '删除成功')
                      await mutate(
                        produce<typeof data>(state => {
                          state.objects.splice(index, 1)
                        }),
                        { revalidate: false }
                      )
                    }}
                  />
                </td>
              </tr>
            ))}
            <TableStatus colSpan={5} isEmpty={data?.delimitedPrefixes.length == 0 && data.objects.length == 0} isLoading={isLoading} />
          </tbody>
        </Table>
      </TableWrapper>
      {/* 复制链接 */}
      {/* <CopyLink ref={copyLinkRef} /> */}
    </Card>
  )
}
