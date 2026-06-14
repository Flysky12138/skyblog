import React from 'react'

export function useMounted() {
  const [mounted, dispatch] = React.useReducer(() => true, false)

  React.useEffect(() => {
    dispatch()
  }, [])

  return mounted
}
