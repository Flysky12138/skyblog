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
import { TypeIcon } from 'lucide-react'

import { TriggerButton } from './_components/button'

const FONT_FAMILIES = [
  { label: '默认', value: '' },
  { label: '微软雅黑', value: 'Microsoft YaHei, sans-serif' },
  { label: '苹方', value: 'PingFang SC, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Comic Sans', value: '"Comic Sans MS", "Comic Sans"' }
] as const

export function FontFamily() {
  const { editor } = useTiptap()
  const { canDo, currentFontFamily, isNodeSelected, isSelectionEmpty } = useTiptapState(({ editor }) => ({
    canDo: editor.can().setFontFamily(''),
    currentFontFamily: editor.getAttributes('textStyle')?.fontFamily as string | undefined,
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
                <TriggerButton aria-label="字体" disabled={isSelectionEmpty || isNodeSelected || !canDo}>
                  <TypeIcon />
                </TriggerButton>
              }
            />
          }
        />
        <TooltipContent>字体</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuRadioGroup
          value={currentFontFamily}
          onValueChange={(value: string) => {
            if (value === '') {
              editor.chain().focus().unsetFontFamily().run()
            } else {
              editor.chain().focus().setFontFamily(value).run()
            }
          }}
        >
          {FONT_FAMILIES.map(({ label, value }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
