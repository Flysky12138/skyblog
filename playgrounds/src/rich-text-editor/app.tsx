import '@repo/rich-text-editor/style.css'
import { Tiptap, useEditor } from '@repo/rich-text-editor'
import { ExtensionKit } from '@repo/rich-text-editor/extensions'
import { ToolBar } from '@repo/rich-text-editor/toolbar'
import { Card } from '@repo/ui/components-self/card'
import { FancyboxRegister } from '@repo/ui/components-self/fancybox'
import { DropdownMenuThemeRadio } from '@repo/ui/components-self/theme'
import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent } from '@repo/ui/components/dialog'
import { Separator } from '@repo/ui/components/separator'
import { useTheme } from '@repo/ui/hooks/use-theme'
import { CopyIcon, PresentationIcon } from 'lucide-react'
import React from 'react'

import content from './content.json'

export function App() {
  const editor = useEditor({
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
    }
  })
  const { ThemeIcon } = useTheme()

  const [open, setOpen] = React.useState(false)
  const [doc, setDoc] = React.useState('')

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
    <div className="relative container mx-auto">
      <FancyboxRegister />
      <Tiptap editor={editor}>
        <Card className="rounded-none">
          <div className="sticky top-0 z-10 bg-card">
            <ToolBar className="flex flex-wrap justify-center p-3">
              <hr className="h-4 w-0.5 rounded-full bg-divide" />
              <DropdownMenuThemeRadio
                render={
                  <Button aria-label="theme toggle" size="icon-sm" variant="outline">
                    <ThemeIcon />
                  </Button>
                }
              />
              <Button
                aria-label="copy"
                size="icon-sm"
                variant="outline"
                onClick={() => {
                  const json = editor.getJSON()
                  void window.navigator.clipboard.writeText(JSON.stringify(json, null, 2))
                }}
              >
                <CopyIcon />
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => {
                    void handlePreview()
                  }}
                >
                  <PresentationIcon />
                </Button>
                <DialogContent className="max-w-5xl bg-card">
                  <article dangerouslySetInnerHTML={{ __html: doc }} className="tiptap" />
                </DialogContent>
              </Dialog>
            </ToolBar>
            <Separator />
          </div>
          <Tiptap.Content className="p-5" />
        </Card>
      </Tiptap>
    </div>
  )
}
