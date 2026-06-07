'use client'

import { Button } from '@repo/ui/components/button'
import { Field, FieldGroup, FieldLabel } from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@repo/ui/components/input-group'
import { Kbd } from '@repo/ui/components/kbd'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { EditorEvents, useTiptap, useTiptapState } from '@tiptap/react'
import { CaseSensitiveIcon, ChevronDownIcon, ChevronUpIcon, SearchIcon } from 'lucide-react'
import React from 'react'

import { TriggerButton } from './_components/button'

export function SearchAndReplace() {
  const { editor } = useTiptap()
  const { caseSensitive, replaceTerm, results, searchTerm, selectedResult } = useTiptapState(({ editor }) => ({
    caseSensitive: editor.storage.searchAndReplace.caseSensitive,
    replaceTerm: editor.storage.searchAndReplace.replaceTerm,
    results: editor.storage.searchAndReplace.results,
    searchTerm: editor.storage.searchAndReplace.searchTerm,
    selectedResult: editor.storage.searchAndReplace.selectedResult
  }))

  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handleTransaction = ({ transaction }: EditorEvents['transaction']) => {
      if (transaction.getMeta('searchAndReplace-open')) {
        setOpen(true)
      }
    }

    editor.on('transaction', handleTransaction)
    return () => {
      editor.off('transaction', handleTransaction)
    }
  }, [editor])

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      const { doc, selection } = editor.state
      if (!selection.empty) {
        const selectedText = doc.textBetween(selection.from, selection.to)
        editor.commands.setSearchTerm(selectedText)
      } else {
        editor.commands.setSearchTerm('')
      }
      editor.commands.setReplaceTerm('')
    } else {
      editor.commands.setSearchTerm('')
      editor.commands.setReplaceTerm('')
    }
    setOpen(newOpen)
  }

  const handleSearchChange = (value: string) => {
    editor.commands.setSearchTerm(value)
  }

  const handleReplaceChange = (value: string) => {
    editor.commands.setReplaceTerm(value)
  }

  const handleSelectNext = () => {
    editor.commands.selectNextResult()
  }

  const handleSelectPrevious = () => {
    editor.commands.selectPreviousResult()
  }

  const handleReplace = () => {
    editor.commands.replace()
  }

  const handleReplaceAll = () => {
    editor.commands.replaceAll()
  }

  const handleToggleCaseSensitive = () => {
    editor.commands.setCaseSensitive(!caseSensitive)
  }

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.shiftKey ? handleSelectPrevious() : handleSelectNext()
      window.requestAnimationFrame(() => {
        const target = event.target as HTMLInputElement
        target.focus()
      })
    }
  }

  const handleReplaceKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleReplace()
      window.requestAnimationFrame(() => {
        const target = event.target as HTMLInputElement
        target.focus()
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <TriggerButton aria-label="搜索替换">
                  <SearchIcon />
                </TriggerButton>
              }
            />
          }
        />
        <TooltipContent>
          搜索替换
          <Kbd>⌘ F</Kbd>
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-80">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="search">搜索</FieldLabel>
            <InputGroup>
              <InputGroupInput
                autoComplete="off"
                id="search"
                placeholder="输入搜索词..."
                value={searchTerm}
                onChange={event => {
                  handleSearchChange(event.target.value)
                }}
                onKeyDown={handleSearchKeyDown}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>{results.length > 0 ? `${selectedResult + 1}/${results.length}` : '0/0'}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field orientation="horizontal">
            <Button aria-label="上一个匹配" disabled={results.length === 0} size="icon" variant="outline" onClick={handleSelectPrevious}>
              <ChevronUpIcon />
            </Button>
            <Button aria-label="下一个匹配" disabled={results.length === 0} size="icon" variant="outline" onClick={handleSelectNext}>
              <ChevronDownIcon />
            </Button>
            <Button aria-label="区分大小写" size="icon" variant={caseSensitive ? 'default' : 'outline'} onClick={handleToggleCaseSensitive}>
              <CaseSensitiveIcon />
            </Button>
          </Field>

          <Field>
            <FieldLabel htmlFor="replace">替换为</FieldLabel>
            <Input
              autoComplete="off"
              id="replace"
              placeholder="输入替换词..."
              value={replaceTerm}
              onChange={event => {
                handleReplaceChange(event.target.value)
              }}
              onKeyDown={handleReplaceKeyDown}
            />
          </Field>

          <Field orientation="horizontal">
            <Button className="grow" disabled={results.length === 0} variant="secondary" onClick={handleReplace}>
              替换
            </Button>
            <Button className="grow" disabled={results.length === 0} variant="default" onClick={handleReplaceAll}>
              全部替换
            </Button>
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}
