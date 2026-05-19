import React from 'react'

type AnyEvent = React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>

/**
 * 无障碍交互的点击事件。`Enter` 和 `Space` 键都会触发点击事件
 */
export const useAccessibleClick = (handler: (event: AnyEvent) => void) => {
  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key == 'Enter') {
        event.preventDefault()
        handler(event)
      }
      if (event.key == ' ') {
        event.preventDefault()
      }
    },
    [handler]
  )

  const onKeyUp = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key == ' ') {
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
