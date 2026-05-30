/* eslint-disable react-hooks/refs */
import React from 'react'

interface UseControllableStateProps<T> {
  defaultValue?: T
  value?: T
  onChange?: (value: T) => void
}

export const useControllableState = <T,>({ defaultValue, value: controlledValue, onChange }: UseControllableStateProps<T>) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue as T)

  const isControlled = controlledValue !== undefined

  const isControlledRef = React.useRef(isControlled)
  isControlledRef.current = isControlled

  const onChangeRef = React.useRef(onChange)
  onChangeRef.current = onChange

  const valueRef = React.useRef<T>(controlledValue ?? internalValue)
  valueRef.current = controlledValue ?? internalValue

  const value = isControlled ? controlledValue : internalValue

  const setValue = React.useCallback((next: ((prev: T) => T) | T) => {
    const currentValue = valueRef.current
    const newValue = next instanceof Function ? next(currentValue) : next
    if (!isControlledRef.current) setInternalValue(newValue)
    onChangeRef.current?.(newValue)
  }, [])

  return [value, setValue] as const
}
