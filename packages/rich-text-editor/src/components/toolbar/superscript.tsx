'use client'

import { Kbd } from '@repo/ui/components/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { NodeSelection } from '@tiptap/pm/state'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { SuperscriptIcon } from 'lucide-react'

import { ToggleButton } from './_components/button'

export function Superscript() {
  const { editor } = useTiptap()
  const { canDo, isActive, isNodeSelected, isSelectionEmpty } = useTiptapState(({ editor }) => ({
    canDo: editor.can().toggleSuperscript(),
    isActive: editor.isActive('superscript'),
    isNodeSelected: editor.state.selection instanceof NodeSelection,
    isSelectionEmpty: editor.state.selection.empty
  }))

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ToggleButton
            aria-label="上标"
            disabled={isSelectionEmpty || isNodeSelected || !canDo}
            pressed={isActive}
            onClick={() => {
              editor.chain().focus().toggleSuperscript().run()
            }}
          >
            <SuperscriptIcon />
          </ToggleButton>
        }
      />
      <TooltipContent>
        上标
        <Kbd>⌘ .</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
