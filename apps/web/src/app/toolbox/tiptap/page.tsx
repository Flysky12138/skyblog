'use client'

import { useWindowScrollState } from '@repo/react-hooks'
import { Tiptap, useEditor } from '@repo/rich-text-editor'
import { ExtensionKit } from '@repo/rich-text-editor/extensions'
import { renderJSONContentToHTMLString } from '@repo/rich-text-editor/render'
import { ToolBar } from '@repo/rich-text-editor/toolbar'
import { Card } from '@repo/ui/components-self/card'
import { DropdownMenuThemeRadio } from '@repo/ui/components-self/theme'
import { Button, buttonVariants } from '@repo/ui/components/button'
import { Dialog, DialogContent } from '@repo/ui/components/dialog'
import { Separator } from '@repo/ui/components/separator'
import { Spinner } from '@repo/ui/components/spinner'
import { useTheme } from '@repo/ui/hooks/use-theme'
import { cn } from '@repo/ui/lib/utils'
import { PresentationIcon } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

import { VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'

export default function Page() {
  const [open, setOpen] = React.useState(false)
  const [doc, setDoc] = React.useState('')

  const { ThemeIcon } = useTheme()
  const { y } = useWindowScrollState()

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

  // 文章 ID
  const {
    data: { value: postId },
    isLoading: isPostIdLoading
  } = useSWR(
    '019fa7f3-3625-7428-8db5-b6b81d6dd8b6',
    () => rpc['edge-config'].get({ query: { key: VERCEL_EDGE_CONFIG_KEY.POST_ID_FOR_TAPTIP } }).then(unwrap),
    {
      fallbackData: {
        value: ''
      }
    }
  )
  // 文章内容
  const { data: post, isLoading: isContentLoading } = useSWR(postId ? ['019fa7fc-7a42-77af-b6e1-63fef14615d9', postId] : null, () => {
    return rpc.posts.tiptap({ id: postId }).get().then(unwrap)
  })

  // 设置内容
  React.useEffect(() => {
    if (!post) return
    if (!editor) return
    const timer = setTimeout(() => {
      const content = post.content?.startsWith('<') ? post.content : (JSON.parse(post.content ?? 'null') as object)
      editor
        .chain()
        .setMeta('addToHistory', false)
        .setContent(content, { contentType: typeof content === 'object' ? 'html' : 'json' })
        .run()
    }, 0)
    return () => {
      clearTimeout(timer)
    }
  }, [editor, post])

  const loading = isPostIdLoading || isContentLoading

  if (!editor) return null

  const handlePreview = async () => {
    const json = editor.getJSON()
    const html = await renderJSONContentToHTMLString(json, { extensions: editor.extensionManager.baseExtensions })
    React.startTransition(() => {
      setDoc(html)
      setOpen(true)
    })
  }

  return (
    <div className="container mx-auto font-article">
      <Tiptap editor={editor}>
        <Card className="h-full overflow-clip rounded-none">
          {/* 工具栏 */}
          <div
            suppressHydrationWarning
            className={cn('sticky top-0 z-10 bg-card transition-shadow', {
              shadow: y > 60
            })}
          >
            <ToolBar className="flex flex-wrap justify-center p-3">
              <hr className="h-4 w-0.5 rounded-full bg-divide" />
              <DropdownMenuThemeRadio
                render={
                  <Button aria-label="theme toggle" size="icon-sm" variant="outline">
                    <ThemeIcon />
                  </Button>
                }
                skeleton={<div className={buttonVariants({ className: 'pointer-events-none', size: 'icon-sm', variant: 'outline' })} />}
              />
              <Dialog open={open} onOpenChange={setOpen}>
                <Button
                  aria-label="预览"
                  size="icon-sm"
                  variant="outline"
                  onClick={() => {
                    void handlePreview()
                  }}
                >
                  <PresentationIcon />
                </Button>
                <DialogContent className="max-w-5xl bg-card font-article">
                  <article dangerouslySetInnerHTML={{ __html: doc }} className="tiptap" />
                </DialogContent>
              </Dialog>
            </ToolBar>
            <Separator />
          </div>
          {/* 编辑区 */}
          <div className="p-5">
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner className="size-8" />
              </div>
            ) : (
              <Tiptap.Content />
            )}
          </div>
        </Card>
      </Tiptap>
    </div>
  )
}
