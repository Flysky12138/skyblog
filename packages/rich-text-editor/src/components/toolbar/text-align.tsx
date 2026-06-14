'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@repo/ui/components/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { Editor, useTiptap, useTiptapState } from '@tiptap/react'
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react'

import { TriggerButton } from './_components/button'

const ALIGNMENTS = [
  { icon: <AlignLeftIcon />, label: '左对齐', shortcut: '⌘⇧L', value: 'start' },
  { icon: <AlignCenterIcon />, label: '居中对齐', shortcut: '⌘⇧E', value: 'center' },
  { icon: <AlignRightIcon />, label: '右对齐', shortcut: '⌘⇧R', value: 'end' },
  { icon: <AlignJustifyIcon />, label: '两端对齐', shortcut: '⌘⇧J', value: 'justify' }
] as const

type Alignment = (typeof ALIGNMENTS)[number]['value']

export function TextAlign() {
  const { editor } = useTiptap()
  const { canDo, currentAlignment, isTextBlock } = useTiptapState(({ editor }) => ({
    canDo: editor.can().unsetTextAlign(),
    currentAlignment: getCurrentAlignment(editor),
    isTextBlock: editor.state.selection.$from.parent.isTextblock
  }))

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              disabled={!canDo}
              render={
                <TriggerButton aria-label="对齐方式">
                  {ALIGNMENTS.find(alignment => alignment.value === currentAlignment)?.icon ?? <AlignLeftIcon />}
                </TriggerButton>
              }
            />
          }
        />
        <TooltipContent>对齐方式</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuRadioGroup
          value={currentAlignment}
          onValueChange={(alignment: Alignment) => {
            editor.chain().focus().setTextAlign(alignment).run()
          }}
        >
          {ALIGNMENTS.map(({ icon, label, shortcut, value }) => (
            <DropdownMenuRadioItem key={value} disabled={value === 'justify' && !isTextBlock} value={value}>
              {icon}
              {label}
              <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getCurrentAlignment(editor: Editor): React.CSSProperties['textAlign'] {
  if (editor.isActive({ textAlign: 'justify' })) return 'justify'
  if (editor.isActive({ textAlign: 'center' })) return 'center'
  if (editor.isActive({ textAlign: 'end' })) return 'end'
  if (editor.isActive({ textAlign: 'right' })) return 'end'
  return 'start'
}
