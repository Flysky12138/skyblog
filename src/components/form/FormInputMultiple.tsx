import { cn } from '@/lib/cn'
import { Add, Close } from '@mui/icons-material'
import { Chip, IconButton, Input, InputProps } from '@mui/joy'
import React from 'react'
import { useSet } from 'react-use'
import { toast } from 'sonner'

interface FormInputMultipleProps<T> extends Pick<InputProps, 'endDecorator'> {
  getChipValue?: (payload: T) => string
  onAdd: (payload: string) => void
  onDelete: (payload: string[]) => void
  value: T[]
}

export default function FormInputMultiple<T = string>({ value, endDecorator, getChipValue, onAdd, onDelete }: FormInputMultipleProps<T>) {
  const [form, setForm] = React.useState('')
  const [selectChips, setSelectChips] = useSet<string>()

  const chipValue = React.useCallback(
    (payload: T) => {
      return getChipValue ? getChipValue(payload) : (payload as string)
    },
    [getChipValue]
  )

  const handleAdd = React.useCallback(() => {
    if (!form) return
    const item = value.find(v => chipValue(v) == form)
    item ? toast.error('存在重复值') : onAdd(form)
    setForm('')
  }, [chipValue, form, onAdd, value])

  const enableBackspaceDeleteChip = React.useRef(false)

  return (
    <Input
      endDecorator={
        <div className="inline-flex gap-x-3">
          {selectChips.size > 0 ? (
            <IconButton
              className="rounded-md"
              color="danger"
              variant="plain"
              onClick={() => {
                onDelete(Array.from(selectChips))
                setSelectChips.reset()
              }}
            >
              <Close />
            </IconButton>
          ) : (
            <IconButton
              className={cn('rounded-md', {
                hidden: !form
              })}
              variant="plain"
              onClick={handleAdd}
            >
              <Add />
            </IconButton>
          )}
          {endDecorator}
        </div>
      }
      {...(value.length > 0
        ? {
            startDecorator: (
              <div className="flex flex-wrap gap-2 py-1">
                {value.map(v => (
                  <Chip
                    key={chipValue(v)}
                    className={cn('rounded', {
                      'outline outline-orange-400 dark:outline-orange-500': selectChips.has(chipValue(v))
                    })}
                    color="primary"
                    onClick={() => setSelectChips.toggle(chipValue(v))}
                  >
                    {chipValue(v)}
                  </Chip>
                ))}
              </div>
            )
          }
        : {})}
      slotProps={{
        input: {
          className: 'min-w-2'
        }
      }}
      value={form}
      variant="outlined"
      onChange={event => setForm(event.target.value)}
      onKeyDown={() => {
        enableBackspaceDeleteChip.current = !form
      }}
      onKeyUp={event => {
        if (event.code == 'Backspace' && enableBackspaceDeleteChip.current) {
          const lastItem = value.at(-1)
          if (lastItem) onDelete([chipValue(lastItem)])
        }
        if (event.code == 'Enter') handleAdd()
      }}
    />
  )
}
