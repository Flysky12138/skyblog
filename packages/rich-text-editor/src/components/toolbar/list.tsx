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
import { ListIcon, ListOrderedIcon, ListTodoIcon, ListXIcon } from 'lucide-react'

import { TriggerButton } from './_components/button'

const LISTS = [
  { icon: <ListOrderedIcon />, label: '有序列表', shortcut: '⇧⌘7', type: 'orderedList' },
  { icon: <ListIcon />, label: '无序列表', shortcut: '⇧⌘8', type: 'bulletList' },
  { icon: <ListTodoIcon />, label: '任务清单', shortcut: '⇧⌘9', type: 'taskList' }
] as const

type Type = (typeof LISTS)[number]['type']

export function List() {
  const { editor } = useTiptap()
  const { currentType } = useTiptapState(({ editor }) => ({
    currentType: getCurrentListType(editor)
  }))

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={<TriggerButton aria-label="列表">{LISTS.find(list => list.type === currentType)?.icon ?? <ListXIcon />}</TriggerButton>}
            />
          }
        />
        <TooltipContent>列表</TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuRadioGroup
          value={currentType}
          onValueChange={(type: Type) => {
            switch (type) {
              case 'bulletList':
                editor.chain().focus().toggleBulletList().run()
                break
              case 'orderedList':
                editor.chain().focus().toggleOrderedList().run()
                break
              case 'taskList':
                editor.chain().focus().toggleTaskList().run()
                break
            }
          }}
        >
          {LISTS.map(({ icon, label, shortcut, type }) => (
            <DropdownMenuRadioItem key={type} value={type}>
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

const getCurrentListType = (editor: Editor): null | Type => {
  if (editor.isActive('taskList')) return 'taskList'
  if (editor.isActive('orderedList')) return 'orderedList'
  if (editor.isActive('bulletList')) return 'bulletList'
  return null
}
