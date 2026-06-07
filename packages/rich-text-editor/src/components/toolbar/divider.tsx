'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useTiptap } from '@tiptap/react'
import { SeparatorHorizontalIcon } from 'lucide-react'

import { TriggerButton } from './_components/button'

export function Divider() {
  const { editor } = useTiptap()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <TriggerButton
            aria-label="分割线"
            onClick={() => {
              editor.chain().focus().setHorizontalRule().run()
            }}
          >
            <SeparatorHorizontalIcon />
          </TriggerButton>
        }
      />
      <TooltipContent>分割线</TooltipContent>
    </Tooltip>
  )
}
