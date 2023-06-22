'use client'

import { cloneDeep } from 'es-toolkit'
import { Draft } from 'immer'
import { Check, ChevronsUpDown, XCircle, XIcon } from 'lucide-react'
import React from 'react'
import { useImmer } from 'use-immer'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

const DEFAULT_FIELD_NAMES = {
  label: 'label',
  value: 'value'
}

interface MultiSelectProps<T> {
  /** 自定义选项字段名称 */
  fieldNames?: { label: keyof T; value: keyof T }
  /**
   * 是否多选
   * @default true
   */
  multiple?: boolean
  /** 选项 */
  options: T[]
  /**
   * 当没有选中值时显示的占位符
   * @default 'Select options'
   */
  placeholder?: string
  /** 选项中的值 */
  value: T[]
  /** 添加选项 */
  onAddOption?: (value: string) => T
  /** 当选中值改变时触发的回调，参数为新的选中值数组 */
  onValueChange: (value: T[]) => void
}

export const MultiSelect = <T extends Record<string, unknown>>({
  fieldNames = DEFAULT_FIELD_NAMES,
  multiple = true,
  options,
  placeholder = 'Select options',
  value: selectedValues,
  onAddOption,
  onValueChange
}: MultiSelectProps<T>) => {
  const [open, setOpen] = React.useState(false)
  // 搜索
  const [search, setSearch] = React.useState('')
  // 新增项
  const [newOptions, setNewOptions] = useImmer<T[]>([])

  /** 获取标签 */
  const getLabel = (target: T) => target[fieldNames['label']] as string
  /** 获取值 */
  const getValue = (target: T) => target[fieldNames['value']] as string

  /** 是否选中 */
  const isSelected = (target: T) => selectedValues.some(item => getLabel(item) == getLabel(target))

  /** 选中/取消选中 */
  const toggleOption = (target: T) => {
    const cloneValues = cloneDeep(selectedValues)
    const index = cloneValues.findIndex(item => getLabel(item) == getLabel(target))
    if (multiple) {
      if (index == -1) {
        cloneValues.push(target)
      } else {
        cloneValues.splice(index, 1)
      }
      onValueChange?.(cloneValues)
    } else {
      onValueChange?.(index == -1 ? [target] : [])
    }
  }

  const mergeOptions = newOptions.concat(options)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button aria-expanded={open} className="flex h-auto min-h-10.5 items-center justify-between" role="combobox" variant="outline">
          {selectedValues.length > 0 ? (
            <>
              <div className="flex grow flex-wrap items-center gap-2">
                {selectedValues.map(option => (
                  <Badge
                    key={getValue(option)}
                    className="border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-sm"
                  >
                    <span className="truncate">{getLabel(option)}</span>
                    <div
                      aria-label={`Remove ${getLabel(option)} from selection`}
                      className={cn(
                        '-m-0.5 ml-2 size-4 cursor-pointer rounded-sm p-0.5',
                        'hover:bg-white/20 focus:ring-1 focus:ring-white/50 focus:outline-none'
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={event => {
                        event.stopPropagation()
                        toggleOption(option)
                      }}
                      onKeyDown={event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          event.stopPropagation()
                          toggleOption(option)
                        }
                      }}
                    >
                      <XCircle className="pointer-events-auto size-3" />
                    </div>
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div
                  aria-label={`Clear all ${selectedValues.length} selected options`}
                  className={cn(
                    'mx-2 flex size-4 cursor-pointer items-center justify-center rounded-sm',
                    'text-muted-foreground hover:text-foreground',
                    'focus:ring-ring focus:ring-2 focus:ring-offset-1 focus:outline-none'
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={event => {
                    event.stopPropagation()
                    onValueChange([])
                  }}
                  onKeyDown={event => {
                    if (event.key == 'Enter' || event.key == ' ') {
                      event.preventDefault()
                      event.stopPropagation()
                      onValueChange([])
                    }
                  }}
                >
                  <XIcon />
                </div>
                <Separator className="flex h-full min-h-6" orientation="vertical" />
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">{placeholder}</p>
          )}
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" aria-multiselectable={multiple} className="w-(--radix-popover-trigger-width) p-0" role="listbox">
        <Command
          filter={(value, search, keywords) => {
            return keywords?.some(keyword => keyword.toLowerCase().includes(search.trim().toLowerCase())) ? 1 : 0
          }}
        >
          <CommandInput
            aria-label="Search through available options"
            placeholder="Search options..."
            value={search}
            onKeyDown={event => {
              if (!onAddOption) return
              if (!search.trim()) return
              if (event.key == 'Enter' || event.key == 'Backspace') {
                event.preventDefault()
                const option = onAddOption(search)
                if (!mergeOptions.some(item => getLabel(item) == getLabel(option))) {
                  setNewOptions(state => {
                    state.unshift(option as Draft<T>)
                  })
                }
                toggleOption(option)
                setSearch('')
              }
            }}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found, Enter to add.</CommandEmpty>
            <CommandGroup>
              {mergeOptions.map(option => (
                <CommandItem
                  key={getValue(option)}
                  className="cursor-pointer"
                  keywords={[getLabel(option)]}
                  role="option"
                  value={getValue(option)}
                  onSelect={() => {
                    toggleOption(option)
                  }}
                >
                  {getLabel(option)}
                  <Check className={cn('ml-auto', isSelected(option) ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
