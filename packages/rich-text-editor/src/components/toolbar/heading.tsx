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
import { Heading1Icon, Heading2Icon, Heading3Icon, Heading4Icon, Heading5Icon, Heading6Icon, HeadingIcon, PilcrowIcon } from 'lucide-react'

import { TriggerButton } from './_components/button'

const HEADINGS = [
  { icon: <PilcrowIcon />, label: '文本', level: 0, shortcut: '⌘⇧0' },
  { icon: <Heading1Icon />, label: '标题一', level: 1, shortcut: '⌘⇧1 ' },
  { icon: <Heading2Icon />, label: '标题二', level: 2, shortcut: '⌘⇧2' },
  { icon: <Heading3Icon />, label: '标题三', level: 3, shortcut: '⌘⇧3' },
  { icon: <Heading4Icon />, label: '标题四', level: 4, shortcut: '⌘⇧4' },
  { icon: <Heading5Icon />, label: '标题五', level: 5, shortcut: '⌘⇧5' },
  { icon: <Heading6Icon />, label: '标题六', level: 6, shortcut: '⌘⇧6' }
] as const

type Level = (typeof HEADINGS)[number]['level']

export function Heading() {
  const { editor } = useTiptap()
  const { canDo, currentLevel } = useTiptapState(({ editor }) => ({
    canDo: editor.can().toggleHeading({ level: 1 }),
    currentLevel: getCurrentHeadingLevel(editor)
  }))

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <TriggerButton aria-label="标题" disabled={!canDo}>
                  {HEADINGS.find(heading => heading.level === currentLevel)?.icon ?? <HeadingIcon />}
                </TriggerButton>
              }
            />
          }
        />
        <TooltipContent>标题</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuRadioGroup
          value={currentLevel}
          onValueChange={(level: Level) => {
            if (level === 0) {
              editor.chain().focus().setParagraph().run()
            } else {
              editor.chain().focus().toggleHeading({ level }).run()
            }
          }}
        >
          {HEADINGS.map(({ icon, label, level, shortcut }) => (
            <DropdownMenuRadioItem key={level} value={level}>
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

function getCurrentHeadingLevel(editor: Editor) {
  for (let level = 1; level <= 6; level++) {
    if (editor.isActive('heading', { level })) {
      return level
    }
  }
  return 0
}
