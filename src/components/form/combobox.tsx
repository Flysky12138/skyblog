'use client'

import { Draft } from 'immer'
import { Check, ChevronsUpDown } from 'lucide-react'
import React from 'react'
import { useImmer } from 'use-immer'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const DEFAULT_FIELD_NAMES = {
  label: 'label',
  value: 'value'
}

interface ComboboxProps<T, M extends boolean> {
  fieldNames?: { label: keyof T; value: keyof T }
  multiple?: M
  options: T[]
  value: ComboboxValueType<T, M>
  onAddOption?: (value: string) => T
  onSelect?: (value: ComboboxValueType<T, M>) => void
}
type ComboboxValueType<T, M extends boolean> = M extends true ? T[] : T

export const Combobox = <T extends Record<string, unknown>, M extends boolean>({
  fieldNames = DEFAULT_FIELD_NAMES,
  multiple,
  options,
  value,
  onAddOption,
  onSelect
}: ComboboxProps<T, M>) => {
  const [open, setOpen] = React.useState(false)
  // 是否多选
  const isMultiple = Array.isArray(value) && multiple
  // 搜索
  const [search, setSearch] = React.useState('')
  // 新增项
  const [newOptions, setNewOptions] = useImmer<T[]>([])

  const getLabel = (target: T) => Reflect.get(target, fieldNames['label']) as string
  const getValue = (target: T) => Reflect.get(target, fieldNames['value']) as string

  // 是否选中
  const isSelected = (target: T) => {
    if (isMultiple) {
      return value.some(it => getLabel(it) == getLabel(target))
    } else {
      return getLabel(target) == getLabel(value as T)
    }
  }

  // 选中/取消选中
  const handleSelect = (target: T) => {
    if (isMultiple) {
      const selectValues = Array.from(value)
      const index = selectValues.findIndex(it => getLabel(it) == getLabel(target))
      if (index == -1) {
        selectValues.push(target)
      } else {
        selectValues.splice(index, 1)
      }
      onSelect?.(selectValues as ComboboxValueType<T, M>)
    } else {
      onSelect?.((value ? null : target) as ComboboxValueType<T, M>)
    }
  }

  const mergeOptions = newOptions.concat(options)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} className="justify-between" role="combobox" variant="outline">
          <p className="truncate">{isMultiple ? value.map(getLabel).join('、') : getLabel(value as T)}</p>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width)! p-0">
        <Command>
          <CommandInput
            placeholder="Search or Add"
            value={search}
            onKeyDown={event => {
              if (event.key == 'Enter' && search && onAddOption) {
                event.preventDefault()
                const option = onAddOption(search)
                if (!mergeOptions.some(it => getLabel(it) == getLabel(option))) {
                  setNewOptions(state => {
                    state.unshift(option as Draft<T>)
                  })
                }
                handleSelect(option)
                setSearch('')
              }
            }}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No data.</CommandEmpty>
            <CommandGroup>
              {mergeOptions.map(it => (
                <CommandItem
                  key={getValue(it)}
                  value={getLabel(it)}
                  onSelect={() => {
                    handleSelect(it)
                  }}
                >
                  {getLabel(it)}
                  <Check className={cn('ml-auto', isSelected(it) ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
