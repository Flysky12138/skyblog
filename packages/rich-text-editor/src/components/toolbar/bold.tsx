'use client'

import { Kbd } from '@repo/ui/components/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { NodeSelection } from '@tiptap/pm/state'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { BoldIcon } from 'lucide-react'

import { ToggleButton } from './_components/button'

export function Bold() {
  const { editor } = useTiptap()
  const { isActive, isActiveParagraph, isNodeSelected, isSelectionEmpty } = useTiptapState(({ editor }) => ({
    isActive: editor.isActive('bold'),
    isActiveParagraph: editor.isActive('paragraph'),
    isNodeSelected: editor.state.selection instanceof NodeSelection,
    isSelectionEmpty: editor.state.selection.empty
  }))

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ToggleButton
            aria-label="加粗"
            disabled={isSelectionEmpty || isNodeSelected || !isActiveParagraph}
            pressed={isActive}
            onClick={() => {
              editor.chain().focus().toggleBold().run()
            }}
          >
            <BoldIcon />
          </ToggleButton>
        }
      />
      <TooltipContent>
        加粗
        <Kbd>⌘ B</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
