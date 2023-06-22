'use client'

import { isEqual } from 'es-toolkit'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { useRouter } from 'nextjs-toploader/app'
import React from 'react'
import { useAsync, useDebounce, useWindowSize } from 'react-use'
import { toast } from 'sonner'
import { useImmer } from 'use-immer'

import { MDXClient } from '@/components/mdx/client'
import { MonacoEditor, MonacoEditorRef } from '@/components/monaco-editor'
import { markdownConfig } from '@/components/monaco-editor/languages/markdown'
import { ErrorComponent } from '@/components/static/error-component'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useBroadcastChannel } from '@/hooks/use-broadcast-channel'
import { authClient } from '@/lib/auth/client'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { EditorToolbar, EditorToolbarProps } from './_components/editor-toolbar'
import {
  DEFAULT_POST,
  DefaultPostType,
  MessageEventDataPostPreviewMounted,
  MessageEventDataPostUpdate,
  POST_PREVIEW_BROADCAST_CHANNEL_ID
} from './utils'

export default function Page({ params }: PageProps<'/dashboard/posts/[id]'>) {
  const router = useRouter()
  const { width } = useWindowSize()
  const { data: session } = authClient.useSession()

  const { id } = React.use(params)
  const isCreate = id == 'create'

  // 文章数据
  const [post, setPost] = useImmer(DEFAULT_POST)
  const [oldValue, setOldValue] = useImmer({
    code: '',
    post: DEFAULT_POST
  })

  // Diff 对比模式
  const [isCompare, setIsCompare] = React.useState(false)
  // 右侧窗口预览数据
  const [previewContent, setPreviewContent] = React.useState(post.content)

  // 工具栏拖动限制区域引用
  const dragConstraintsRef = React.useRef<HTMLDivElement>(null)
  // 编辑器引用
  const editorRef = React.useRef<MonacoEditorRef>(null)

  // 初始化数据
  const initData = React.useEffectEvent((data: DefaultPostType | null) => {
    if (!data) return
    setPost(data)
    setOldValue(draft => {
      draft.code = data.content || ''
      draft.post = data
    })
  })

  // 请求数据
  useAsync(async () => {
    if (isCreate) return
    const data = await rpc.dashboard.posts({ id }).get().then(unwrap)
    initData(data)
  }, [id])

  const { postMessage } = useBroadcastChannel<MessageEventDataPostPreviewMounted, MessageEventDataPostUpdate>(
    POST_PREVIEW_BROADCAST_CHANNEL_ID,
    ({ type }, channel) => {
      // 窗口加载完成后获取一次预览数据
      if (type != 'post-preview-mounted') return
      setPreviewContent(post.content)
      channel.postMessage({ type: 'post-update', value: post } satisfies MessageEventDataPostUpdate)
    }
  )
  // 预览数据更新
  useDebounce(
    () => {
      setPreviewContent(post.content)
      postMessage({ type: 'post-update', value: post })
    },
    1000,
    [post]
  )

  // 禁用按钮
  const disabled = React.useMemo(
    () => ({
      format: isCompare,
      save: isCreate ? !post.content : isEqual(post, oldValue.post)
    }),
    [isCompare, isCreate, oldValue.post, post]
  )

  // 创建
  const handleCreate = React.useEffectEvent(async () => {
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
          content: post.content,
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
  })

  // 更新
  const handleUpdate: EditorToolbarProps['onUpdate'] = React.useEffectEvent(async type => {
    if (!post.title) {
      toast.error('表单验证失败', { richColors: true })
      return
    }
    const data = await toastPromise(
      rpc.dashboard
        .posts({ id })
        .put({
          categories: post.categories.map(({ category }) => category.name),
          content: post.content,
          isPublished: post.isPublished,
          pinOrder: post.pinOrder,
          slug: post.slug,
          summary: post.summary,
          tags: post.tags.map(({ tag }) => tag.name),
          title: post.title,
          updatedAt: type == 'normal' ? new Date().toISOString() : undefined,
          visibilityMask: post.visibilityMask
        })
        .then(unwrap),
      {
        success: '更新成功'
      }
    )
    initData(data)
  })

  return (
    <div ref={dragConstraintsRef} className="relative flex h-full max-h-screen overflow-hidden">
      <EditorToolbar
        className="absolute bottom-2 left-1/2 z-50 -translate-x-1/2"
        disabled={disabled}
        dragConstraints={dragConstraintsRef}
        isCreate={isCreate}
        post={post}
        setPost={setPost}
        onCompare={() => {
          setIsCompare(prev => !prev)
        }}
        onCreate={handleCreate}
        onFormat={() => {
          editorRef.current?.format()
        }}
        onPreview={() => {
          window.open(`/posts/preview`, '_blank')
        }}
        onUpdate={handleUpdate}
      />

      <ResizablePanelGroup orientation={width < 1200 ? 'vertical' : 'horizontal'}>
        <ResizablePanel defaultSize={60}>
          <MonacoEditor
            ref={editorRef}
            isDiffMode={isCompare}
            originalValue={oldValue.code}
            value={post.content || ''}
            onChange={value => {
              setPost(draft => {
                draft.content = value || null
              })
            }}
            {...markdownConfig}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <ScrollArea className="h-full *:data-[slot=scroll-area-viewport]:*:block!">
            <ErrorBoundary
              errorComponent={props => (
                <div className="flex justify-center p-5">
                  <ErrorComponent {...props} />
                </div>
              )}
            >
              <article className="bg-card min-h-screen max-w-none p-5 pb-[80vh]">
                <MDXClient source={previewContent || ''} />
              </article>
            </ErrorBoundary>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
