'use client'

import { Kbd } from '@repo/ui/components/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { TextQuoteIcon } from 'lucide-react'

import { ToggleButton } from './_components/button'

export function Blockquote() {
  const { editor } = useTiptap()
  const { canDo, isActive } = useTiptapState(({ editor }) => ({
    canDo: editor.can().toggleBlockquote(),
    isActive: editor.isActive('blockquote')
  }))

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ToggleButton
            aria-label="引用"
            disabled={!canDo}
            pressed={isActive}
            onClick={() => {
              editor.chain().focus().toggleBlockquote().run()
            }}
          >
            <TextQuoteIcon />
          </ToggleButton>
        }
      />
      <TooltipContent>
        引用
        <Kbd>⌘ ⇧ B</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
