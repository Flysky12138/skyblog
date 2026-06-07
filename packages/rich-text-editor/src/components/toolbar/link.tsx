'use client'

import { Button } from '@repo/ui/components/button'
import { Field, FieldGroup, FieldLabel } from '@repo/ui/components/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@repo/ui/components/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { NodeSelection } from '@tiptap/pm/state'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { Link2Icon, Link2OffIcon, XIcon } from 'lucide-react'
import React from 'react'

import { ToggleButton } from './_components/button'

export function Link() {
  const { editor } = useTiptap()
  const { canDo, isActive, isNodeSelected, isSelectionEmpty } = useTiptapState(({ editor }) => ({
    canDo: editor.can().setLink({ href: '' }),
    isActive: editor.isActive('link'),
    isNodeSelected: editor.state.selection instanceof NodeSelection,
    isSelectionEmpty: editor.state.selection.empty
  }))

  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState('')

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      const attrs = editor.getAttributes('link') as React.AnchorHTMLAttributes<HTMLAnchorElement>
      setUrl(attrs.href ?? '')
    } else {
      setUrl('')
    }
    setOpen(newOpen)
  }

  const handleSetLink = () => {
    const href = url.trim()
    if (!href) return
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    setOpen(false)
    setUrl('')
  }

  const handleUnsetLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setOpen(false)
    setUrl('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSetLink()
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <ToggleButton aria-label="链接" disabled={isSelectionEmpty || isNodeSelected || !canDo} pressed={isActive}>
                  <Link2Icon />
                </ToggleButton>
              }
            />
          }
        />
        <TooltipContent>链接</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-80">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="url">{isActive ? '编辑链接' : '插入链接'}</FieldLabel>
            <InputGroup>
              <InputGroupInput
                autoComplete="off"
                className="text-ellipsis"
                id="url"
                placeholder="输入链接地址..."
                value={url}
                onChange={e => {
                  setUrl(e.target.value)
                }}
                onKeyDown={handleKeyDown}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label="clear"
                  size="icon-xs"
                  variant="secondary"
                  onClick={() => {
                    setUrl('')
                  }}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field orientation="horizontal">
            {isActive && (
              <Button size="icon" variant="outline" onClick={handleUnsetLink}>
                <Link2OffIcon />
              </Button>
            )}
            <Button className="grow" disabled={!url.trim()} onClick={handleSetLink}>
              {isActive ? '更新' : '插入'}
            </Button>
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}
