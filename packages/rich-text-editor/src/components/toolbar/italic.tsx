'use client'

import { Kbd } from '@repo/ui/components/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { NodeSelection } from '@tiptap/pm/state'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { ItalicIcon } from 'lucide-react'

import { ToggleButton } from './_components/button'

export function Italic() {
  const { editor } = useTiptap()
  const { canDo, isActive, isNodeSelected, isSelectionEmpty } = useTiptapState(({ editor }) => ({
    canDo: editor.can().toggleItalic(),
    isActive: editor.isActive('italic'),
    isNodeSelected: editor.state.selection instanceof NodeSelection,
    isSelectionEmpty: editor.state.selection.empty
  }))

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ToggleButton
            aria-label="斜体"
            disabled={isSelectionEmpty || isNodeSelected || !canDo}
            pressed={isActive}
            onClick={() => {
              editor.chain().focus().toggleItalic().run()
            }}
          >
            <ItalicIcon />
          </ToggleButton>
        }
      />
      <TooltipContent>
        斜体
        <Kbd>⌘ I</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
