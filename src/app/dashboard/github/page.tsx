'use client'

import ImageViewer, { ImageViewerProps } from '@/components/image/ImageViewer'
import ModalDelete from '@/components/modal/ModalDelete'
import { cn } from '@/lib/cn'
import { EXT } from '@/lib/keys'
import { deleteAllGithubRepos, deleteGithubRepos, getAllGithubRepos, getGithubRepos, githubFileDirectUrl } from '@/lib/server/github'
import { CustomToast } from '@/lib/toast'
import { Close, Link as LinkIcon } from '@mui/icons-material'
import { Button, IconButton } from '@mui/joy'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import { useImmer } from 'use-immer'
import CopyLink, { CopyLinkRef } from './_/CopyLink'
import Header from './_/Header'
import ListItem from './_/ListItem'
import SyncImageInfo from './_/SyncImageInfo'
import UploadFiles from './_/UploadFiles'

export default function Page() {
  const router = useRouter()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const path = searchParams.get('path') || ''
  const paths = path.split('/').filter(v => v) || []
  const { isLoading, data, mutate } = useSWR(`/api/dashboard/github/repo/${path}`, () => getGithubRepos(path), {
    fallbackData: []
  })

  const [photoView, setPhotoView] = useImmer<Pick<ImageViewerProps, 'images' | 'visible' | 'index'>>({ images: [], index: 0, visible: false })

  const copyLinkRef = React.useRef<CopyLinkRef>(null)

  return (
    <>
      {/* 表头 */}
      <Header>
        <SyncImageInfo path={path} />
        <div className="flex">
          {['文件', '文件夹'].map(name => (
            <UploadFiles
              key={name}
              component={props => (
                <Button
                  className={cn('focus-visible:z-10', {
                    'rounded-l-none': name == '文件夹',
                    'rounded-r-none border-r-0': name == '文件'
                  })}
                  size="sm"
                  variant="outlined"
                  {...props}
                >
                  {name}
                </Button>
              )}
              isUploadDirectory={name == '文件夹'}
              path={('/' + path + '/').replace(/\/{2,}/g, '/')}
              onSubmit={async () => {
                await mutate()
              }}
            />
          ))}
        </div>
      </Header>
      {/* 文件列表 */}
      <div className="s-border-color-card relative divide-y overflow-clip rounded-lg rounded-t-none border border-t-0 dark:s-bg-card *:border-inherit">
        {path.length > 0 && (
          <ListItem
            {...(Array.isArray(data) && {
              endDecorator: (
                <IconButton
                  variant="soft"
                  onClick={async event => {
                    event.stopPropagation()
                    if (data.find(file => file.type == 'dir')) {
                      const toastId = toast.loading('Loading')
                      const files = await getAllGithubRepos(path)
                      toast.dismiss(toastId)
                      copyLinkRef.current?.asyncOpen(files.tree)
                    } else {
                      copyLinkRef.current?.open(data)
                    }
                  }}
                >
                  <LinkIcon />
                </IconButton>
              )
            })}
            onClick={() => {
              const prePath = paths.slice(0, -1).join('/')
              router.replace(`${pathname}${prePath ? `?path=${prePath}` : ''}`)
            }}
          />
        )}
        {isLoading ? (
          <p className="flex h-10 items-center justify-center">Loading...</p>
        ) : Array.isArray(data) ? (
          <>
            {data.map(file => (
              <ListItem
                key={file.sha}
                disabled={!(file.type == 'dir' || EXT.IMAGE.some(ext => file.name.endsWith(ext)))}
                endDecorator={
                  <>
                    {file.type == 'file' && (
                      <IconButton
                        variant="soft"
                        onClick={event => {
                          event.stopPropagation()
                          copyLinkRef.current?.open([file])
                        }}
                      >
                        <LinkIcon />
                      </IconButton>
                    )}
                    <ModalDelete
                      component={props => (
                        <IconButton color="danger" variant="soft" {...props}>
                          <Close />
                        </IconButton>
                      )}
                      title="删除？"
                      onSubmit={async () => {
                        await CustomToast(
                          file.type == 'file'
                            ? deleteGithubRepos(file.path, { message: `delete ${file.name}`, sha: file.sha })
                            : deleteAllGithubRepos(file.path, ({ path }) => `delete ${path.slice(path.lastIndexOf('/') + 1)}`),
                          '删除成功'
                        )
                        await mutate(
                          data.filter(v => v.sha != file.sha),
                          { revalidate: false }
                        )
                      }}
                    />
                  </>
                }
                value={file}
                onClick={() => {
                  if (file.type == 'dir') router.replace(`${pathname}?path=${paths.concat(file.name).join('/')}`)
                  else if (EXT.IMAGE.some(ext => file.name.endsWith(ext))) {
                    const images = data.filter(f => EXT.IMAGE.some(ext => f.name.endsWith(ext)))
                    setPhotoView({
                      images: images.map(image => ({ key: image.sha, src: githubFileDirectUrl(image.path) })),
                      index: Math.max(
                        0,
                        images.findIndex(image => image.sha == file.sha)
                      ),
                      visible: true
                    })
                  }
                }}
              />
            ))}
            {data.length == 0 && <p className="py-3 text-center">无内容</p>}
          </>
        ) : null}
      </div>
      {/* 图片预览 */}
      <ImageViewer
        onClose={() => {
          setPhotoView(state => {
            state.visible = false
            state.index = 0
          })
        }}
        onIndexChange={index => {
          setPhotoView(state => {
            state.index = index
          })
        }}
        {...photoView}
      />
      {/* 复制链接 */}
      <CopyLink ref={copyLinkRef} />
    </>
  )
}
