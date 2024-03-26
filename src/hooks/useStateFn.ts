import React from 'react'

export default function useStateFn<T>(effect: () => T, deps?: React.DependencyList) {
  const [state, setState] = React.useState<T | null>(null)

  React.useEffect(() => {
    setState(effect())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return [state]
}
