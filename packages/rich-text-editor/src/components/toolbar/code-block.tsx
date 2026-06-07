'use client'

import { Button } from '@repo/ui/components/button'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@repo/ui/components/combobox'
import { Field, FieldGroup, FieldLabel } from '@repo/ui/components/field'
import { Kbd } from '@repo/ui/components/kbd'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { groupBy, mapValues } from 'es-toolkit'
import { CodeIcon } from 'lucide-react'
import React from 'react'
import { grammars } from 'tm-grammars'
import { themes } from 'tm-themes'

import { CodeBlockShikiAttributes } from '../../extensions/code-block-shiki'
import { defaultDarkTheme, defaultLanguage, defaultLightTheme } from '../../lib/shiki/highlighter'
import { ToggleButton } from './_components/button'

const grammarItems = grammars
  .map(grammar => ({ label: grammar.name, value: grammar.name }))
  .concat([
    { label: 'plaintext', value: 'plaintext' },
    { label: 'ansi', value: 'ansi' }
  ])
  .sort((a, b) => a.label.localeCompare(b.label))

const themeItems = mapValues(
  groupBy(themes, item => item.type),
  items => items.map(theme => ({ label: theme.name, value: theme.name })).sort((a, b) => a.label.localeCompare(b.label))
)

export function CodeBlock() {
  const { editor } = useTiptap()
  const { canDo, darkTheme, isActive, language, lightTheme } = useTiptapState(({ editor }) => {
    const { darkTheme, language, lightTheme } = editor.isActive('codeBlock') ? (editor.getAttributes('codeBlock') as CodeBlockShikiAttributes) : {}
    return {
      canDo: editor.can().toggleCodeBlock(),
      darkTheme: darkTheme ?? defaultDarkTheme,
      isActive: editor.isActive('codeBlock'),
      language: language ?? defaultLanguage,
      lightTheme: lightTheme ?? defaultLightTheme
    }
  })

  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState({ darkTheme, language, lightTheme })

  const initialRef = React.useRef({ darkTheme, language, lightTheme })

  const handleOpenChange = (open: boolean) => {
    if (open) {
      const values = { darkTheme, language, lightTheme }
      initialRef.current = values
      setPending(values)
    }
    setOpen(open)
  }

  const handleCancel = () => {
    const { darkTheme, language, lightTheme } = initialRef.current
    editor.chain().updateAttributes('codeBlock', { darkTheme, language, lightTheme }).run()
    setPending({ darkTheme, language, lightTheme })
    setOpen(false)
  }

  const handleRemove = () => {
    editor.chain().toggleCodeBlock().run()
    setOpen(false)
  }

  const handleConfirm = () => {
    if (!isActive) {
      editor
        .chain()
        .setCodeBlock({ language: pending.language })
        .setCodeBlockDarkTheme(pending.darkTheme)
        .setCodeBlockLightTheme(pending.lightTheme)
        .run()
    }
    setOpen(false)
  }

  const handleSelectedOptionScrollIntoView: React.ComponentProps<typeof Combobox>['onOpenChange'] = (open, { event }) => {
    if (!open) return
    const target = event.currentTarget as HTMLDivElement
    setTimeout(() => {
      target.querySelector('[role="option"][aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
    })
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <ToggleButton aria-label="代码块" disabled={!canDo} pressed={isActive}>
                  <CodeIcon />
                </ToggleButton>
              }
            />
          }
        />
        <TooltipContent>
          代码块
          <Kbd>⌘ ⌥ C</Kbd>
        </TooltipContent>
      </Tooltip>
      <PopoverContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="language">语言</FieldLabel>
            <Combobox
              autoHighlight
              items={grammarItems}
              value={pending.language}
              onOpenChange={handleSelectedOptionScrollIntoView}
              onValueChange={language => {
                if (!language) return
                setPending(prev => ({ ...prev, language }))
                if (isActive) {
                  editor.chain().updateAttributes('codeBlock', { language }).run()
                }
              }}
            >
              <ComboboxInput showClear autoComplete="off" id="language" />
              <ComboboxContent>
                <ComboboxEmpty>无选项</ComboboxEmpty>
                <ComboboxList>
                  {(item: (typeof grammarItems)[number]) => (
                    <ComboboxItem key={item.value} value={item.value}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
          <Field>
            <FieldLabel htmlFor="light-theme">亮色主题</FieldLabel>
            <Combobox
              autoHighlight
              items={themeItems.light}
              value={pending.lightTheme}
              onOpenChange={handleSelectedOptionScrollIntoView}
              onValueChange={theme => {
                if (!theme) return
                setPending(prev => ({ ...prev, lightTheme: theme }))
                if (isActive) {
                  editor.chain().updateAttributes('codeBlock', { lightTheme: theme }).run()
                }
              }}
            >
              <ComboboxInput showClear autoComplete="off" id="light-theme" />
              <ComboboxContent>
                <ComboboxEmpty>无选项</ComboboxEmpty>
                <ComboboxList>
                  {(item: (typeof themeItems.light)[number]) => (
                    <ComboboxItem key={item.value} value={item.value}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
          <Field>
            <FieldLabel htmlFor="dark-theme">暗色主题</FieldLabel>
            <Combobox
              autoHighlight
              items={themeItems.dark}
              value={pending.darkTheme}
              onOpenChange={handleSelectedOptionScrollIntoView}
              onValueChange={theme => {
                if (!theme) return
                setPending(prev => ({ ...prev, darkTheme: theme }))
                if (isActive) {
                  editor.chain().updateAttributes('codeBlock', { darkTheme: theme }).run()
                }
              }}
            >
              <ComboboxInput showClear autoComplete="off" id="dark-theme" />
              <ComboboxContent>
                <ComboboxEmpty>无选项</ComboboxEmpty>
                <ComboboxList>
                  {(item: (typeof themeItems.dark)[number]) => (
                    <ComboboxItem key={item.value} value={item.value}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
          <Field orientation="horizontal">
            {isActive ? (
              <>
                <Button className="w-16" variant="outline" onClick={handleRemove}>
                  移除
                </Button>
                <Button className="grow" onClick={handleCancel}>
                  撤销
                </Button>
              </>
            ) : (
              <Button className="grow" onClick={handleConfirm}>
                确定
              </Button>
            )}
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}
