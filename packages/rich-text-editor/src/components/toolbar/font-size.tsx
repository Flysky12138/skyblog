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
import { ALargeSmallIcon } from 'lucide-react'

import { TriggerButton } from './_components/button'

const FONT_SIZES = [
  { label: '默认', value: '' },
  { label: '0.5', value: '0.5em' },
  { label: '0.75', value: '0.75em' },
  { label: '0.875', value: '0.875em' },
  // { label: '1', value: '1em' },
  { label: '1.125', value: '1.125em' },
  { label: '1.25', value: '1.25em' },
  { label: '1.5', value: '1.5em' },
  { label: '1.75', value: '1.75em' },
  { label: '2', value: '2em' },
  { label: '2.5', value: '2.5em' },
  { label: '3', value: '3em' },
  { label: '4', value: '4em' }
] as const

export function FontSize() {
  const { editor } = useTiptap()
  const { currentFontSize, isActiveParagraph, isNodeSelected, isSelectionEmpty } = useTiptapState(({ editor }) => ({
    currentFontSize: (editor.getAttributes('textStyle')?.fontSize as string | undefined) ?? '',
    isActiveParagraph: editor.isActive('paragraph'),
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
                <TriggerButton aria-label="字号" disabled={isSelectionEmpty || isNodeSelected || !isActiveParagraph}>
                  <ALargeSmallIcon />
                </TriggerButton>
              }
            />
          }
        />
        <TooltipContent>字号 {currentFontSize}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuRadioGroup
          value={currentFontSize}
          onValueChange={(value: string) => {
            if (value === '') {
              editor.chain().focus().unsetFontSize().run()
            } else {
              editor.chain().focus().setFontSize(value).run()
            }
          }}
        >
          {FONT_SIZES.map(({ label, value }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
