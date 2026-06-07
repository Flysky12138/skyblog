'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { NodeSelection } from '@tiptap/pm/state'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { RemoveFormattingIcon } from 'lucide-react'

import { TriggerButton } from './_components/button'

export function ClearFormatting() {
  const { editor } = useTiptap()
  const { isNodeSelected } = useTiptapState(({ editor }) => ({
    isNodeSelected: editor.state.selection instanceof NodeSelection
  }))

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <TriggerButton
            aria-label="清除格式"
            disabled={isNodeSelected}
            onClick={() => {
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }}
          >
            <RemoveFormattingIcon />
          </TriggerButton>
        }
      />
      <TooltipContent>清除格式</TooltipContent>
    </Tooltip>
  )
}
