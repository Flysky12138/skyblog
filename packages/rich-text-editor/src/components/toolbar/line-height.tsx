'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@repo/ui/components/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { NodeSelection } from '@tiptap/pm/state'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { TextCursorIcon } from 'lucide-react'

import { TriggerButton } from './_components/button'

const LINE_HEIGHTS = [
  { label: '默认', value: '' },
  // { label: '1', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.25', value: '1.25' },
  { label: '1.5', value: '1.5' },
  { label: '1.75', value: '1.75' },
  { label: '2', value: '2' },
  { label: '2.5', value: '2.5' },
  { label: '3', value: '3' },
  { label: '3.5', value: '3.5' },
  { label: '4', value: '4' }
] as const

export function LineHeight() {
  const { editor } = useTiptap()
  const { canDo, currentLineHeight, isNodeSelected, isSelectionEmpty } = useTiptapState(({ editor }) => ({
    canDo: editor.can().unsetLineHeight(),
    currentLineHeight: (editor.getAttributes('textStyle')?.lineHeight as string | undefined) ?? '',
    isNodeSelected: editor.state.selection instanceof NodeSelection,
    isSelectionEmpty: editor.state.selection.empty
  }))

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <TriggerButton aria-label="行高" disabled={isSelectionEmpty || isNodeSelected || !canDo}>
                  <TextCursorIcon />
                </TriggerButton>
              }
            />
          }
        />
        <TooltipContent>行高 {currentLineHeight}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuRadioGroup
          value={currentLineHeight}
          onValueChange={(value: string) => {
            if (value === '') {
              editor.chain().focus().unsetLineHeight().run()
            } else {
              editor.chain().focus().setLineHeight(value).run()
            }
          }}
        >
          {LINE_HEIGHTS.map(({ label, value }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
