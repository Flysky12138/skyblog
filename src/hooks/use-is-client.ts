import React from 'react'

export const useIsClient = () => {
  const [isClient, setIsClient] = React.useState(false)

  React.useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
