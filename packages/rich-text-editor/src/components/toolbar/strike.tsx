'use client'

import { Kbd } from '@repo/ui/components/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { NodeSelection } from '@tiptap/pm/state'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { StrikethroughIcon } from 'lucide-react'

import { ToggleButton } from './_components/button'

export function Strike() {
  const { editor } = useTiptap()
  const { canDo, isActive, isNodeSelected, isSelectionEmpty } = useTiptapState(({ editor }) => ({
    canDo: editor.can().toggleStrike(),
    isActive: editor.isActive('strike'),
    isNodeSelected: editor.state.selection instanceof NodeSelection,
    isSelectionEmpty: editor.state.selection.empty
  }))

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ToggleButton
            aria-label="中划线"
            disabled={isSelectionEmpty || isNodeSelected || !canDo}
            pressed={isActive}
            onClick={() => {
              editor.chain().focus().toggleStrike().run()
            }}
          >
            <StrikethroughIcon />
          </ToggleButton>
        }
      />
      <TooltipContent>
        中划线
        <Kbd>⌘ ⇧ S</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
