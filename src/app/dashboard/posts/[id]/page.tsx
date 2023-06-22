'use client'

import { isEqual } from 'es-toolkit'
import { useSession } from 'next-auth/react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useAsync, useDebounce, useEvent, useWindowSize } from 'react-use'
import { toast } from 'sonner'
import { useImmer } from 'use-immer'
import { uuidv7 } from 'uuidv7'

import { GET } from '@/app/api/dashboard/posts/[id]/route'
import { MDXClient } from '@/components/mdx/client'
import { MonacoEditor, MonacoEditorRef } from '@/components/monaco-editor'
import { markdownConfig } from '@/components/monaco-editor/languages/markdown'
import { ErrorComponent } from '@/components/static/error-component'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { POST_CARD_DISPLAY } from '@/lib/constants'
import { CustomRequest } from '@/lib/http/request'
import { Toast } from '@/lib/toast'

import { EditorToolbar, EditorToolbarProps } from './_components/editor-toolbar'

export type DefaultPostType = NonNullable<GET['return']>
export interface MessageEventDataMounted extends MessageEventData<'post-preview-mounted'> {}
export interface MessageEventDataRefresh extends MessageEventData<'post-refresh', DefaultPostType> {}

const DEFAULT_POST: DefaultPostType = {
  authorId: '',
  categories: [],
  content: null,
  createdAt: new Date(),
  description: null,
  display: POST_CARD_DISPLAY.HEADER | POST_CARD_DISPLAY.ISSUES | POST_CARD_DISPLAY.TOC,
  id: '-1',
  links: 0,
  published: false,
  sticky: 0,
  tags: [],
  title: '',
  updatedAt: new Date(),
  views: 0
}

export default function Page({ params }: PageProps<'/dashboard/posts/[id]'>) {
  const router = useRouter()
  const session = useSession()
  const { width } = useWindowSize()

  const { id } = React.use(params)
  const isCreate = id == 'new'

  // 文章数据
  const [post, setPost] = useImmer(DEFAULT_POST)
  const oldPost = React.useRef(DEFAULT_POST)
  const oldCode = React.useRef('')

  // Diff 对比模式
  const [isCompare, setIsCompare] = React.useState(false)
  // 右侧窗口预览数据
  const [previewContent, setPreviewContent] = React.useState(post.content)

  // 工具栏拖动限制区域引用
  const dragConstraintsRef = React.useRef<HTMLDivElement>(null)
  // 编辑器引用
  const editorRef = React.useRef<MonacoEditorRef>(null)
  // 预览窗口引用
  const previewWindowRef = React.useRef<WindowProxy>(null)

  // 初始化数据
  const initData = (data: DefaultPostType | null) => {
    if (!data) return
    setPost(data)
    oldPost.current = data
    oldCode.current = data.content || ''
  }

  // 请求数据
  useAsync(async () => {
    if (isCreate) return
    const data = await CustomRequest('GET /api/dashboard/posts/[id]', { params: { id } })
    initData(data)
  }, [id])

  // 预览数据更新
  const refreshPreviewWindow = () => {
    setPreviewContent(post.content)
    previewWindowRef.current?.postMessage({ type: 'post-refresh', value: post } satisfies MessageEventDataRefresh, window.origin)
  }
  useDebounce(refreshPreviewWindow, 1000, [post])

  // 窗口加载完成后获取一次预览数据
  useEvent('message', ({ data, origin }: MessageEvent<MessageEventDataMounted>) => {
    if (origin != window.origin || data.type != 'post-preview-mounted') return
    refreshPreviewWindow()
  })

  // 创建
  const handleCreate = async () => {
    if (!post.title) {
      toast.error('表单验证失败', { richColors: true })
      return
    }
    const data = await Toast(
      CustomRequest('POST /api/dashboard/posts/[id]', {
        body: {
          authorId: session.data?.id || uuidv7(),
          categories: post.categories.map(({ name }) => name),
          content: post.content,
          description: post.description,
          display: post.display,
          published: post.published,
          sticky: post.sticky,
          tags: post.tags.map(({ name }) => name),
          title: post.title
        },
        params: { id }
      }),
      {
        success: '保存成功'
      }
    )
    router.replace(`/dashboard/posts/${data.id}`)
  }

  // 更新
  const handleUpdate: EditorToolbarProps['onUpdate'] = async type => {
    if (!post.title) {
      toast.error('表单验证失败', { richColors: true })
      return
    }
    const data = await Toast(
      CustomRequest('PUT /api/dashboard/posts/[id]', {
        body: {
          categories: post.categories.map(({ name }) => name),
          content: post.content,
          description: post.description,
          display: post.display,
          published: post.published,
          sticky: post.sticky,
          tags: post.tags.map(({ name }) => name),
          title: post.title,
          updatedAt: type == 'normal' ? new Date() : undefined
        },
        params: { id }
      }),
      {
        success: '保存成功'
      }
    )
    initData(data)
  }

  return (
    <div ref={dragConstraintsRef} className="relative flex h-full max-h-screen overflow-hidden">
      <style>{`main { padding: 0 !important }`}</style>
      <EditorToolbar
        className="absolute bottom-2 left-1/2 z-50 -translate-x-1/2"
        disabled={{
          format: isCompare,
          // eslint-disable-next-line react-hooks/refs
          save: isCreate ? !post.content : isEqual(post, oldPost.current)
        }}
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
          previewWindowRef.current = window.open(`/posts/preview`, '_blank')
        }}
        onUpdate={handleUpdate}
      />
      <ResizablePanelGroup direction={width < 1200 ? 'vertical' : 'horizontal'}>
        <ResizablePanel defaultSize={60}>
          <MonacoEditor
            ref={editorRef}
            code={post.content || ''}
            diffMode={isCompare}
            // eslint-disable-next-line react-hooks/refs
            oldCode={oldCode.current}
            onChange={value => {
              setPost(state => {
                state.content = value || null
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
