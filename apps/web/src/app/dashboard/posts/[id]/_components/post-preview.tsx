'use client'

import { Editor } from '@repo/rich-text-editor'
import { renderJSONContentToHTMLString } from '@repo/rich-text-editor/render'
import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent } from '@repo/ui/components/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { PresentationIcon } from 'lucide-react'
import React from 'react'

interface PostPreviewProps {
  disabled?: boolean
  editor: Editor
}

export default function PostPreview({ disabled, editor }: PostPreviewProps) {
  const [open, setOpen] = React.useState(false)
  const [doc, setDoc] = React.useState('')

  const handlePreview = async () => {
    const json = editor.getJSON()
    const html = await renderJSONContentToHTMLString(json, { extensions: editor.extensionManager.baseExtensions })
    React.startTransition(() => {
      setDoc(html)
      setOpen(true)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              aria-label="预览"
              disabled={disabled}
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
      <DialogContent className="max-w-5xl bg-card" fullScreen="sm">
        <article dangerouslySetInnerHTML={{ __html: doc }} className="tiptap" />
      </DialogContent>
    </Dialog>
  )
}
