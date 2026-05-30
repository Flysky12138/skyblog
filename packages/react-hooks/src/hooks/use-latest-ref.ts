import React from 'react'

export const useLatestRef = <T>(value: T) => {
  const ref = React.useRef(value)

  // eslint-disable-next-line react-hooks/refs
  ref.current = value

  return ref
}
