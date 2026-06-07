'use client'

import { useWindowScrollState } from '@repo/react-hooks'
import { Tiptap, useEditor } from '@repo/rich-text-editor'
import { ExtensionKit } from '@repo/rich-text-editor/extensions'
import { ToolBar } from '@repo/rich-text-editor/toolbar'
import { Card } from '@repo/ui/components-self/card'
import { DropdownMenuThemeRadio } from '@repo/ui/components-self/theme'
import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent } from '@repo/ui/components/dialog'
import { Separator } from '@repo/ui/components/separator'
import { useTheme } from '@repo/ui/hooks/use-theme'
import { cn } from '@repo/ui/lib/utils'
import { PresentationIcon } from 'lucide-react'
import { motion } from 'motion/react'
import React from 'react'

import { Style } from '@/components/style'

import content from '../../../../../../playgrounds/src/rich-text-editor/content.json'

export default function Page() {
  const editor = useEditor({
    autofocus: true,
    content,
    contentType: 'json',
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
    onMount: () => {
      setIsMounted(true)
    }
  })
  const { ThemeIcon } = useTheme()
  const { y } = useWindowScrollState()

  const [open, setOpen] = React.useState(false)
  const [doc, setDoc] = React.useState('')
  const [isMounted, setIsMounted] = React.useState(false)

  if (!editor) {
    return null
  }

  const handlePreview = async () => {
    const html = await editor.getHTMLAsync()
    React.startTransition(() => {
      setDoc(html)
      setOpen(true)
    })
  }

  return (
    <>
      <Style>{`
        html {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar {
          display: none;
        }
      `}</Style>
      <div className="relative container mx-auto font-article">
        <Tiptap editor={editor}>
          <Card className="overflow-clip rounded-none">
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
            <motion.div
              animate={isMounted ? 'active' : 'inactive'}
              initial="inactive"
              variants={{
                active: {
                  opacity: 1,
                  transition: {
                    opacity: { duration: 0.4, ease: 'easeOut' }
                  }
                },
                inactive: {
                  opacity: 0
                }
              }}
            >
              <Tiptap.Content className="p-5" />
            </motion.div>
          </Card>
        </Tiptap>
      </div>
    </>
  )
}
