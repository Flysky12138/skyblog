import React from 'react'

export const useMounted = () => {
  const [mounted, dispatch] = React.useReducer(() => true, false)

  React.useEffect(() => {
    dispatch()
  }, [])

  return mounted
}
