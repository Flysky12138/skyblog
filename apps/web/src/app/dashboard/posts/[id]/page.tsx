'use client'

import { Content, Tiptap, useEditor } from '@repo/rich-text-editor'
import { ExtensionKit } from '@repo/rich-text-editor/extensions'
import { ToolBar, Separator as ToolBarSeparator } from '@repo/rich-text-editor/toolbar'
import { toast } from '@repo/ui/base'
import { Button } from '@repo/ui/components/button'
import { Separator } from '@repo/ui/components/separator'
import { Spinner } from '@repo/ui/components/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { CloudUploadIcon } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'
import React from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { StorageUploadModal } from '@/app/dashboard/storage/_components/storage-upload-modal'
import { authClient } from '@/lib/auth/client'
import { STORAGE } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { PostMetaDrawer, PostSubmitEventType } from './_components/post-meta-drawer'
import PostPreview from './_components/post-preview'
import { createInitialPost } from './utils'

export default function Page({ params }: PageProps<'/dashboard/posts/[id]'>) {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const { id } = React.use(params)
  const isCreate = id === 'create'

  const [isEditorEmpty, setIsEditorEmpty] = React.useState(true)
  const [post, setPost] = useImmer(createInitialPost())

  const editor = useEditor({
    editable: true,
    emitContentError: true,
    enableContentCheck: false,
    extensions: [ExtensionKit],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        role: 'textbox',
        spellcheck: 'false'
      }
    },
    onUpdate: ({ editor }) => {
      setIsEditorEmpty(editor.isEmpty)
    }
  })

  // 获取文章数据，仅仅为了缓存
  const { data, isLoading } = useSWR(
    isCreate ? null : ['019f84e6-d45f-7630-869b-bbab2af4a4f7', id],
    () => rpc.dashboard.posts({ id }).get().then(unwrap),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: setPost
    }
  )

  // 填充编辑器内容
  React.useEffect(() => {
    if (!data) return
    if (!editor) return
    const timer = setTimeout(() => {
      editor
        .chain()
        .setMeta('addToHistory', false)
        .setContent(JSON.parse(data.content ?? 'null') as Content, { contentType: 'json' })
        .run()
    }, 0)
    return () => {
      clearTimeout(timer)
    }
  }, [data, editor])

  if (!editor) return null

  const handleSubmit = async (type: PostSubmitEventType) => {
    const baseData = {
      categories: post.categories.map(({ category }) => category.name),
      content: JSON.stringify(editor.getJSON()),
      isPublished: post.isPublished,
      pinOrder: post.pinOrder,
      slug: post.slug,
      summary: post.summary,
      tags: post.tags.map(({ tag }) => tag.name),
      title: post.title,
      visibilityMask: post.visibilityMask
    }
    if (type === 'create') {
      if (!session?.user?.id) {
        toast.error('请先登录', { richColors: true })
        return
      }
      const data = await toastPromise(rpc.dashboard.posts.post({ authorId: session.user.id, ...baseData }).then(unwrap), {
        success: '创建成功'
      })
      setPost(createInitialPost())
      router.replace(`/dashboard/posts/${data.id}`)
    } else {
      await toastPromise(
        rpc.dashboard
          .posts({ id })
          .put({ updatedAt: type === 'normal' ? new Date().toISOString() : undefined, ...baseData })
          .then(unwrap),
        {
          success: '更新成功'
        }
      )
    }
  }

  return (
    <div className="flex h-screen flex-col bg-card">
      <Tiptap editor={editor}>
        <div className="bg-sidebar shadow-xs">
          <ToolBar className="flex flex-wrap justify-center p-3">
            <ToolBarSeparator />

            <Tooltip>
              <StorageUploadModal id={STORAGE.ROOT_DIRECTORY_ID}>
                <TooltipTrigger render={<Button aria-label="文件" disabled={isCreate} size="icon" variant="outline" />}>
                  <CloudUploadIcon />
                </TooltipTrigger>
              </StorageUploadModal>
              <TooltipContent>文件</TooltipContent>
            </Tooltip>

            <PostPreview disabled={isEditorEmpty} editor={editor} />

            <ToolBarSeparator />

            <PostMetaDrawer isCreate={isCreate} value={post} onChange={setPost} onSubmit={handleSubmit} />
          </ToolBar>
          <Separator />
        </div>
        <div className="h-full scroll-fade-b overflow-y-auto px-3 py-5 md:px-5 md:py-8">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner className="size-8" />
            </div>
          ) : (
            <Tiptap.Content />
          )}
        </div>
      </Tiptap>
    </div>
  )
}
