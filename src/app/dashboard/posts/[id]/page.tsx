'use client'

import { REFRESH_MESSAGE } from '@/app/(client)/posts/[id]/_components/Refresh'
import { GET } from '@/app/api/dashboard/posts/[id]/route'
import UploadFiles from '@/app/dashboard/r2/[[...slug]]/_components/UploadFiles'
import MonacoEditor from '@/components/monaco-editor'
import { markdownConfig } from '@/components/monaco-editor/language/markdown'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { AddPhotoAlternate, OpenInNew, PostAdd, Save } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useAsync } from 'react-use'
import { toast } from 'sonner'
import { useImmer } from 'use-immer'
import { uuidv7 } from 'uuidv7'
import ModelDetail from './_components/ModelDetail'

export type DefaultPostType = NonNullable<GET['return']>

const defaultPost: DefaultPostType = {
  authorId: '',
  categories: [],
  content: null,
  createdAt: new Date(),
  description: null,
  id: '-1',
  links: 0,
  published: false,
  showTitleCard: true,
  sticky: 0,
  tags: [],
  title: '',
  updatedAt: new Date(),
  views: 0
}

export default function Page() {
  const router = useRouter()
  const session = useSession()

  const { id } = useParams<{ id: string }>()
  const isCreate = id == 'new'

  const [post, setPost] = useImmer<DefaultPostType>(defaultPost)
  const [oldCode, setOldCode] = React.useState<string>()

  useAsync(async () => {
    if (isCreate) return
    const data = await CustomRequest('GET api/dashboard/posts/[id]', { params: { id } })
    if (!data) return
    setPost(data)
    setOldCode(data.content || '')
  }, [id, setPost])

  // 预览窗口
  const openWindowRef = React.useRef<WindowProxy | null>(null)
  const sendRefreshMessage = () => {
    openWindowRef.current?.postMessage(REFRESH_MESSAGE, window.origin)
  }

  return (
    <>
      <style>{`main{ padding: 0 !important }`}</style>
      <MonacoEditor
        className="rounded-none border-none [&>div]:s-border-color-divider"
        code={post.content || ''}
        height="calc(100dvh - 50px)"
        loading="Loading..."
        oldCode={oldCode}
        toolbarRender={({ Divider, Space }) => (
          <>
            <Space />
            <Tooltip title={isCreate ? '创建' : '更新'}>
              <IconButton
                disabled={isCreate && !post.content}
                onClick={async () => {
                  if (!post.title) {
                    toast.error('表单验证失败')
                    return
                  }
                  const data = await Toast(
                    isCreate
                      ? CustomRequest('POST api/dashboard/posts/[id]', {
                          body: {
                            authorId: session.data?.id || uuidv7(),
                            categories: post.categories.map(({ name }) => name),
                            content: post.content,
                            description: post.description,
                            showTitleCard: post.showTitleCard,
                            sticky: post.sticky,
                            tags: post.tags.map(({ name }) => name),
                            title: post.title
                          },
                          params: { id: 'new' }
                        })
                      : CustomRequest('PUT api/dashboard/posts/[id]', {
                          body: {
                            categories: post.categories.map(({ name }) => name),
                            content: post.content,
                            description: post.description,
                            showTitleCard: post.showTitleCard,
                            sticky: post.sticky,
                            tags: post.tags.map(({ name }) => name),
                            title: post.title
                          },
                          params: { id: post.id }
                        }),
                    '保存成功'
                  )
                  if (isCreate) {
                    router.replace(`/dashboard/posts/${data.id}`)
                  } else {
                    setPost(data)
                    setOldCode(post.content || '')
                    sendRefreshMessage()
                  }
                }}
              >
                <Save />
              </IconButton>
            </Tooltip>
            <Divider />
            <Tooltip title="查看">
              <IconButton
                disabled={isCreate}
                onClick={() => {
                  openWindowRef.current = window.open(`/posts/${post.id}`, '_blank')
                }}
              >
                <OpenInNew />
              </IconButton>
            </Tooltip>
            <Divider />
            <ModelDetail
              component={props => (
                <Tooltip title="文件信息">
                  <IconButton {...props}>
                    <PostAdd />
                  </IconButton>
                </Tooltip>
              )}
              value={post}
              onChange={setPost}
            />
            <UploadFiles
              component={props => (
                <Tooltip title="上传图片">
                  <IconButton disabled={isCreate} {...props}>
                    <AddPhotoAlternate />
                  </IconButton>
                </Tooltip>
              )}
              path={`/posts/${post.id}/`}
            />
            <Divider />
          </>
        )}
        onChange={value => {
          setPost(state => {
            state.content = value || null
          })
        }}
        {...markdownConfig}
      />
    </>
  )
}
