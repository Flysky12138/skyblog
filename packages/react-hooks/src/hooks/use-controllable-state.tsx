import React from 'react'

interface UseControllableStateProps<T> {
  defaultValue?: T
  value?: T
  onChange?: (value: T) => void
}

export const useControllableState = <T,>({ defaultValue, value: controlledValue, onChange }: UseControllableStateProps<T>) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue as T)

  const isControlled = controlledValue != undefined

  const value = isControlled ? controlledValue : internalValue

  const setValue = React.useCallback(
    (next: ((prev: T) => T) | T) => {
      const newValue = next instanceof Function ? next(value) : next
      if (!isControlled) setInternalValue(newValue)
      onChange?.(newValue)
    },
    [isControlled, onChange, value]
  )

  return [value, setValue] as const
}
