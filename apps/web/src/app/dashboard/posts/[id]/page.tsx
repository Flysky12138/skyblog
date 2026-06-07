'use client'

import { Tiptap, useEditor } from '@repo/rich-text-editor'
import { ExtensionKit } from '@repo/rich-text-editor/extensions'
import { ToolBar } from '@repo/rich-text-editor/toolbar'
import { toast } from '@repo/ui/base'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@repo/ui/components/alert-dialog'
import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent } from '@repo/ui/components/dialog'
import { Separator } from '@repo/ui/components/separator'
import { Spinner } from '@repo/ui/components/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { CloudUploadIcon, EyeClosedIcon, EyeIcon, PresentationIcon, ReceiptTextIcon, SaveIcon } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'
import React from 'react'
import { useAsync } from 'react-use'
import { useImmer } from 'use-immer'

import { StorageUploadModal } from '@/app/dashboard/storage/_components/storage-upload-modal'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { authClient } from '@/lib/auth/client'
import { STORAGE } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { PostEditModal } from './_components/post-edit-modal'
import { createInitialPost, PostType } from './utils'

export default function Page({ params }: PageProps<'/dashboard/posts/[id]'>) {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const { id } = React.use(params)
  const isCreate = id === 'create'

  const [open, setOpen] = React.useState(false)
  const [doc, setDoc] = React.useState('')

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
    }
  })

  // 文章数据
  const [post, setPost] = useImmer(createInitialPost())

  // 初始化数据
  const initData = (data: null | PostType) => {
    if (!data) return
    setPost(data)
    editor
      ?.chain()
      .setMeta('addToHistory', false)
      .setContent(data.content, {
        contentType: data.content?.startsWith('<') ? 'html' : 'markdown'
      })
      .run()
  }

  // 请求数据
  const { loading } = useAsync(async () => {
    if (isCreate) return
    if (!editor) return
    const data = await rpc.dashboard.posts({ id }).get().then(unwrap)
    initData(data)
  }, [id, editor])

  if (!editor) return null

  // 创建
  const handleCreate = async () => {
    if (!post.title) {
      toast.error('表单验证失败', { richColors: true })
      return
    }
    if (!session?.user?.id) {
      toast.error('请先登录', { richColors: true })
      return
    }
    const data = await toastPromise(
      rpc.dashboard.posts
        .post({
          authorId: session.user.id,
          categories: post.categories.map(({ category }) => category.name),
          content: await editor.getHTMLAsync(),
          isPublished: post.isPublished,
          pinOrder: post.pinOrder,
          slug: post.slug,
          summary: post.summary,
          tags: post.tags.map(({ tag }) => tag.name),
          title: post.title,
          visibilityMask: post.visibilityMask
        })
        .then(unwrap),
      {
        success: '创建成功'
      }
    )
    router.replace(`/dashboard/posts/${data.id}`)
  }

  // 更新
  const handleUpdate = async (type: 'normal' | 'secret') => {
    try {
      if (!post.title) {
        toast.error('表单验证失败', { richColors: true })
        return
      }
      const data = await toastPromise(
        rpc.dashboard
          .posts({ id })
          .put({
            categories: post.categories.map(({ category }) => category.name),
            content: await editor.getHTMLAsync(),
            isPublished: post.isPublished,
            pinOrder: post.pinOrder,
            slug: post.slug,
            summary: post.summary,
            tags: post.tags.map(({ tag }) => tag.name),
            title: post.title,
            updatedAt: type === 'normal' ? new Date().toISOString() : undefined,
            visibilityMask: post.visibilityMask
          })
          .then(unwrap),
        {
          success: '更新成功'
        }
      )
      initData(data)
    } catch (error) {
      console.error(error)
    }
  }

  // 预览
  const handlePreview = async () => {
    const html = await editor.getHTMLAsync()
    React.startTransition(() => {
      setDoc(html)
      setOpen(true)
    })
  }

  return (
    <div className="flex h-screen flex-col bg-card">
      <Tiptap editor={editor}>
        <div className="bg-sidebar shadow-xs">
          <ToolBar className="flex flex-wrap justify-center p-3">
            <hr className="h-4 w-0.5 rounded-full bg-divide" />
            <Tooltip>
              <StorageUploadModal id={STORAGE.ROOT_DIRECTORY_ID}>
                <TooltipTrigger render={<Button aria-label="文件" disabled={isCreate} size="icon" variant="outline" />}>
                  <CloudUploadIcon />
                </TooltipTrigger>
              </StorageUploadModal>
              <TooltipContent>文件</TooltipContent>
            </Tooltip>
            <Tooltip>
              <PostEditModal value={post} onChange={setPost}>
                <TooltipTrigger render={<Button aria-label="信息" size="icon" variant="outline" />}>
                  <ReceiptTextIcon />
                </TooltipTrigger>
              </PostEditModal>
              <TooltipContent>信息</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    aria-label={post.isPublished ? '公开' : '隐藏'}
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setPost(state => {
                        state.isPublished = !state.isPublished
                      })
                    }}
                  />
                }
              >
                {post.isPublished ? <EyeIcon /> : <EyeClosedIcon />}
              </TooltipTrigger>
              <TooltipContent>{post.isPublished ? '公开' : '隐藏'}</TooltipContent>
            </Tooltip>
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger render={<AlertDialogTrigger render={<Button aria-label={isCreate ? '创建' : '更新'} size="icon" />} />}>
                  <SaveIcon />
                </TooltipTrigger>
                <TooltipContent>{isCreate ? '创建' : '更新'}</TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>更新方式</AlertDialogTitle>
                  <AlertDialogDescription>不修改更新时间，可以悄悄更新文章</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <DisplayByConditional
                    condition={isCreate}
                    fallback={
                      <>
                        <AlertDialogAction
                          onClick={() => {
                            void handleUpdate('secret')
                          }}
                        >
                          悄悄更新
                        </AlertDialogAction>
                        <AlertDialogAction
                          onClick={() => {
                            void handleUpdate('normal')
                          }}
                        >
                          更新
                        </AlertDialogAction>
                      </>
                    }
                  >
                    <AlertDialogAction
                      onClick={() => {
                        void handleCreate()
                      }}
                    >
                      创建
                    </AlertDialogAction>
                  </DisplayByConditional>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <hr className="h-4 w-0.5 rounded-full bg-divide" />
            <Dialog open={open} onOpenChange={setOpen}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label="预览"
                      size="icon-sm"
                      variant="outline"
                      onClick={() => {
                        void handlePreview()
                      }}
                    />
                  }
                >
                  <PresentationIcon />
                </TooltipTrigger>
                <TooltipContent>预览</TooltipContent>
              </Tooltip>
              <DialogContent className="max-w-5xl bg-card">
                <article dangerouslySetInnerHTML={{ __html: doc }} className="tiptap" />
              </DialogContent>
            </Dialog>
          </ToolBar>
          <Separator />
        </div>
        <div className="h-full overflow-y-auto px-3 py-5 md:px-5 md:py-8">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner className="size-8" />
            </div>
          ) : (
            <Tiptap.Content className="font-article" />
          )}
        </div>
      </Tiptap>
    </div>
  )
}
