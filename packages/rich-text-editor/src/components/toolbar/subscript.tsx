'use client'

import { Kbd } from '@repo/ui/components/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { NodeSelection } from '@tiptap/pm/state'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { SubscriptIcon } from 'lucide-react'

import { ToggleButton } from './_components/button'

export function Subscript() {
  const { editor } = useTiptap()
  const { canDo, isActive, isNodeSelected, isSelectionEmpty } = useTiptapState(({ editor }) => ({
    canDo: editor.can().toggleSubscript(),
    isActive: editor.isActive('subscript'),
    isNodeSelected: editor.state.selection instanceof NodeSelection,
    isSelectionEmpty: editor.state.selection.empty
  }))

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ToggleButton
            aria-label="下标"
            disabled={isSelectionEmpty || isNodeSelected || !canDo}
            pressed={isActive}
            onClick={() => {
              editor.chain().focus().toggleSubscript().run()
            }}
          >
            <SubscriptIcon />
          </ToggleButton>
        }
      />
      <TooltipContent>
        下标
        <Kbd>⌘ ,</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
