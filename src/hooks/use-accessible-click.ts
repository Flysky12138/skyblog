import React from 'react'

type AnyEvent = React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>

export const useAccessibleClick = (handler: (event: AnyEvent) => void) => {
  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key == 'Enter') {
        event.preventDefault()
        handler(event)
      }
      if (event.code == 'Space') {
        event.preventDefault()
      }
    },
    [handler]
  )

  const onKeyUp = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.code == 'Space') {
        event.preventDefault()
        handler(event)
      }
    },
    [handler]
  )

  return {
    role: 'button',
    tabIndex: 0,
    onKeyDown,
    onKeyUp
  } as const
}
