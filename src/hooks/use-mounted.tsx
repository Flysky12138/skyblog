import { isBrowser } from 'es-toolkit'
import React from 'react'

export const useMounted = () => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    if (!isBrowser()) return
    setMounted(true)
  }, [])

  return mounted
}
