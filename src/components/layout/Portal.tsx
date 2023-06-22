'use client'

import { Portal as MuiPortal, PortalProps } from '@mui/material'
import React from 'react'

interface PortalPropsType extends Omit<PortalProps, 'container'> {
  delay?: number
  selector: string
}

export default function Portal({ children, selector, delay = 0, disablePortal, ...props }: PortalPropsType) {
  const [portalContainer, setPortalContainer] = React.useState<Element>()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.querySelector(selector)
      if (el) setPortalContainer(el)
    }, delay)
    return () => {
      clearTimeout(timer)
    }
  }, [selector, delay])

  if (disablePortal) return null

  return (
    <>
      {portalContainer && (
        <MuiPortal container={portalContainer} {...props}>
          {children}
        </MuiPortal>
      )}
    </>
  )
}
