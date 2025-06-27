import { isBrowser } from 'es-toolkit'
import React from 'react'

interface State {
  x: number
  xProgress: number
  y: number
  yProgress: number
}

const getState = (): State =>
  isBrowser()
    ? {
        x: window.pageXOffset,
        xProgress: Math.round((window.pageXOffset / (document.documentElement.scrollWidth - document.documentElement.clientWidth)) * 100) || 0,
        y: window.pageYOffset,
        yProgress: Math.round((window.pageYOffset / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100) || 0
      }
    : { x: 0, xProgress: 0, y: 0, yProgress: 0 }

export const useWindowScroll = () => {
  const [state, setState] = React.useState(getState)

  React.useEffect(() => {
    const handler = () => {
      setState(state => {
        const { x, xProgress, y, yProgress } = getState()
        return state.x != x || state.y != y ? { x, xProgress, y, yProgress } : state
      })
    }

    handler()

    window.addEventListener('scroll', handler, {
      capture: false,
      passive: true
    })

    return () => {
      window.addEventListener('scroll', handler)
    }
  }, [])

  return state
}
