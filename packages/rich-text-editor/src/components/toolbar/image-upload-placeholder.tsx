'use client'

import { Kbd } from '@repo/ui/components/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useTiptap } from '@tiptap/react'
import { ImagePlusIcon } from 'lucide-react'

import { TriggerButton } from './_components/button'

export function ImageUploadPlaceholder() {
  const { editor } = useTiptap()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <TriggerButton
            aria-label="图片"
            onClick={() => {
              editor.chain().focus().insertContent({ type: 'imageUploadPlaceholder' }).run()
            }}
          >
            <ImagePlusIcon />
          </TriggerButton>
        }
      />
      <TooltipContent>
        图片
        <Kbd>⌘ ⇧ I</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
