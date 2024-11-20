'use client'

import { Popover, PopoverProps } from '@mui/material'
import React from 'react'

export interface PopoverCoreProps extends Omit<PopoverProps, 'children' | 'open' | 'onClose'> {
  children?:
    | React.ReactNode
    | React.FC<{
        close: () => void
      }>
  component: React.FC<
    {
      onClick: React.MouseEventHandler<HTMLElement>
      onKeyDown: React.KeyboardEventHandler<HTMLElement>
    } & Pick<React.HTMLAttributes<HTMLElement>, 'role'>
  >
  disabled?: boolean
  onClose?: () => void
  onOpen?: () => void
}

export interface PopoverCoreRef {
  openToggle: (payload?: boolean) => void
}

const PopoverCore: React.ForwardRefRenderFunction<PopoverCoreRef | undefined, PopoverCoreProps> = (
  { children, component: Component, disabled, onClose, onOpen, ...props },
  ref
) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpenToggle = (payload: boolean) => {
    if (disabled) return
    payload ? onOpen?.() : onClose?.()
    setIsOpen(payload)
  }

  const handleClose = () => {
    if (disabled) return
    handleOpenToggle(false)
    onClose?.()
  }

  React.useImperativeHandle(ref, () => ({
    openToggle: payload => handleOpenToggle(payload ?? !isOpen)
  }))

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  return (
    <>
      <Component
        role="button"
        onClick={event => {
          event.stopPropagation()
          setAnchorEl(event.currentTarget)
          handleOpenToggle(true)
        }}
        onKeyDown={event => {
          if (event.code != 'Enter') return
          event.stopPropagation()
          setAnchorEl(event.currentTarget)
          handleOpenToggle(true)
        }}
      />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'center'
        }}
        open={isOpen}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top'
        }}
        onClose={handleClose}
        {...props}
      >
        {typeof children == 'function' ? children({ close: handleClose }) : children}
      </Popover>
    </>
  )
}

export default React.forwardRef(PopoverCore)
