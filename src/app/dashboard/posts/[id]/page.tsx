'use client'

import { GET, PUT } from '@/app/api/dashboard/posts/[id]/route'
import { ErrorComponent } from '@/components/error-component'
import { MDXClient } from '@/components/mdx/client'
import { MonacoEditorRef } from '@/components/monaco-editor'
import { markdownConfig } from '@/components/monaco-editor/languages/markdown'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { isEqual } from 'es-toolkit'
import { AppWindow, CloudUpload, Eye, EyeClosed, GitCompare, ReceiptText, Save, WandSparkles } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useAsync, useDebounce, useEvent } from 'react-use'
import { toast } from 'sonner'
import { useImmer } from 'use-immer'
import { uuidv7 } from 'uuidv7'
import { R2Upload } from '../../r2/[[...slug]]/_components/r2-upload'
import { PostDetail } from './_components/post-detail'

export type DefaultPostType = NonNullable<GET['return']>
export interface MessageEventDataRefreshType extends MessageEventData<'post-refresh', DefaultPostType> {}
export interface MessageEventDataMountedType extends MessageEventData<'post-preview-mounted'> {}

const DEFAULT_POST: DefaultPostType = {
  authorId: '',
  categories: [],
  content: null,
  createdAt: new Date(),
  description: null,
  display: (1 << 3) - 1,
  id: '-1',
  links: 0,
  published: false,
  sticky: 0,
  tags: [],
  title: '',
  updatedAt: new Date(),
  views: 0
}

export default function Page({ params }: DynamicRouteProps<{ id: string }>) {
  const router = useRouter()
  const session = useSession()

  const { id } = React.use(params)
  const isCreate = id == 'new'

  const [post, setPost] = useImmer<DefaultPostType>(DEFAULT_POST)

  const oldPost = React.useRef<DefaultPostType>(DEFAULT_POST)
  const oldCode = React.useRef<string>('')

  // Diff 对比模式
  const [diffMode, setDiffMode] = React.useState(false)
  // 右侧窗口预览数据
  const [previewContent, setPreviewContent] = React.useState(post.content)

  // 编辑器引用
  const editorRef = React.useRef<MonacoEditorRef>(null)
  // 预览窗口引用
  const previewWindowRef = React.useRef<WindowProxy | null>(null)

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
    const data = await CustomRequest('GET api/dashboard/posts/[id]', { params: { id } })
    initData(data)
  }, [id])

  // 预览数据更新
  const refreshPreviewWindow = () => {
    setPreviewContent(post.content)
    previewWindowRef.current?.postMessage({ type: 'post-refresh', value: post } satisfies MessageEventDataRefreshType, window.origin)
  }
  useDebounce(refreshPreviewWindow, 1000, [post])

  // 窗口加载完成后获取一次预览数据
  useEvent('message', ({ data, origin }: MessageEvent<MessageEventDataMountedType>) => {
    if (origin != window.origin || data.type != 'post-preview-mounted') return
    refreshPreviewWindow()
  })

  // 创建/更新
  const handleSave = async () => {
    if (!post.title) {
      toast.error('表单验证失败')
      return
    }
    const putBody: PUT['body'] = {
      categories: post.categories.map(({ name }) => name),
      content: post.content,
      description: post.description,
      display: post.display,
      sticky: post.sticky,
      tags: post.tags.map(({ name }) => name),
      title: post.title
    }
    const data = await Toast(
      isCreate
        ? CustomRequest('POST api/dashboard/posts/[id]', {
            body: {
              authorId: session.data?.id || uuidv7(),
              ...putBody
            },
            params: { id }
          })
        : CustomRequest('PUT api/dashboard/posts/[id]', { body: putBody, params: { id } }),
      {
        success: '保存成功'
      }
    )
    if (isCreate) {
      router.replace(`/dashboard/posts/${data.id}`)
    } else {
      initData(data)
    }
  }

  return (
    <section className="flex h-screen">
      <style>{`main { padding: 0 !important }`}</style>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="flex h-full flex-col">
            <div className="border-divide bg-sidebar flex items-center gap-3 border-b px-3 py-2">
              <TooltipProvider>
                <span aria-hidden="true" className="grow"></span>
                <Separator />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setDiffMode(!diffMode)
                      }}
                    >
                      <GitCompare />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Diff 对比</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={diffMode}
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        editorRef.current?.format()
                      }}
                    >
                      <WandSparkles />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>格式化</TooltipContent>
                </Tooltip>
                <Separator />
                <Tooltip>
                  <TooltipTrigger>
                    <R2Upload path={`/posts/${post.id}/`}>
                      <Button disabled={isCreate} size="icon" variant="outline">
                        <CloudUpload />
                      </Button>
                    </R2Upload>
                  </TooltipTrigger>
                  <TooltipContent>文件</TooltipContent>
                </Tooltip>
                <Separator />
                <Tooltip>
                  <PostDetail value={post} onChange={setPost}>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline">
                        <ReceiptText />
                      </Button>
                    </TooltipTrigger>
                  </PostDetail>
                  <TooltipContent>信息</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setPost(state => {
                          state.published = !state.published
                        })
                      }}
                    >
                      {post.published ? <Eye /> : <EyeClosed />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{post.published ? '公开' : '隐藏'}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        previewWindowRef.current = window.open(`/posts/${id}/preview`, '_blank')
                      }}
                    >
                      <AppWindow />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>预览</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button disabled={isCreate ? !post.content : isEqual(post, oldPost.current)} size="icon" onClick={handleSave}>
                      <Save />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isCreate ? '创建' : '更新'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <MonacoEditor
              ref={editorRef}
              code={post.content || ''}
              diffMode={diffMode}
              oldCode={oldCode.current}
              onChange={value => {
                setPost(state => {
                  state.content = value || null
                })
              }}
              {...markdownConfig}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <ScrollArea className="h-full [&_[data-slot='scroll-area-viewport']]:*:block!">
            <ErrorBoundary
              errorComponent={props => (
                <div className="flex justify-center p-5">
                  <ErrorComponent {...props} />
                </div>
              )}
            >
              <article className="min-h-screen max-w-none">
                <MDXClient value={previewContent || ''} />
              </article>
            </ErrorBoundary>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  )
}

const Separator = () => <hr className="bg-divide h-4 w-0.5 rounded-full"></hr>

const MonacoEditor = dynamic(() => import('@/components/monaco-editor'), { ssr: false })
