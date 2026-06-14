import React from 'react'

import { useLatestRef } from './use-latest-ref'

interface UseControllableStateProps<T> {
  defaultValue?: T
  value?: T
  onChange?: (value: T) => void
}

export function useControllableState<T>({ defaultValue, value: controlledValue, onChange }: UseControllableStateProps<T>) {
  const [internalValue, setInternalValue] = React.useState(defaultValue as T)

  const isControlled = controlledValue !== undefined

  const isControlledRef = useLatestRef(isControlled)
  const onChangeRef = useLatestRef(onChange)
  const valueRef = useLatestRef(controlledValue ?? internalValue)

  const value = isControlled ? controlledValue : internalValue

  const setValue = React.useCallback((next: ((prev: T) => T) | T) => {
    const currentValue = valueRef.current
    const newValue = next instanceof Function ? next(currentValue) : next
    if (!isControlledRef.current) setInternalValue(newValue)
    onChangeRef.current?.(newValue)
  }, [])

  return [value, setValue] as const
}
