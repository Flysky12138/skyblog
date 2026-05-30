import { isBrowser } from 'es-toolkit'
import React from 'react'

interface State {
  x: number
  xProgress: number
  y: number
  yProgress: number
}

const getState = (): State => {
  if (!isBrowser()) {
    return { x: 0, xProgress: 0, y: 0, yProgress: 0 }
  }

  const { pageXOffset: x, pageYOffset: y } = window
  const { clientHeight, clientWidth, scrollHeight, scrollWidth } = document.documentElement

  return {
    x,
    xProgress: Math.round((x / (scrollWidth - clientWidth)) * 100) || 0,
    y,
    yProgress: Math.round((y / (scrollHeight - clientHeight)) * 100) || 0
  }
}

export const useWindowScrollState = () => {
  const [state, setState] = React.useState(getState)

  React.useEffect(() => {
    const handler = () => {
      const newState = getState()
      setState(oldState => {
        if (oldState.x === newState.x && oldState.y === newState.y) return oldState
        return newState
      })
    }

    window.addEventListener('scroll', handler, {
      capture: false,
      passive: true
    })

    return () => {
      window.removeEventListener('scroll', handler, { capture: false })
    }
  }, [])

  return state
}
