'use client'

import { Kbd } from '@repo/ui/components/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { Redo2Icon, Undo2Icon } from 'lucide-react'

import { ToggleButton } from './_components/button'

export function UndoRedo() {
  const { editor } = useTiptap()
  const { canRedo, canUndo } = useTiptapState(({ editor }) => ({
    canRedo: editor.can().redo(),
    canUndo: editor.can().undo()
  }))

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <ToggleButton
              aria-label="撤销"
              disabled={!canUndo}
              onClick={() => {
                editor.chain().focus().undo().run()
              }}
            >
              <Undo2Icon />
            </ToggleButton>
          }
        />
        <TooltipContent>
          撤销
          <Kbd>⌘ Z</Kbd>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <ToggleButton
              aria-label="重做"
              disabled={!canRedo}
              onClick={() => {
                editor.chain().focus().redo().run()
              }}
            >
              <Redo2Icon />
            </ToggleButton>
          }
        />
        <TooltipContent>
          重做
          <Kbd>⌘ ⇧ Z</Kbd>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
