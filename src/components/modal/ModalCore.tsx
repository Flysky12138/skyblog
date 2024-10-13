'use client'

import { cn } from '@/lib/cn'
import { LinearProgress, Modal, ModalDialog, ModalDialogProps, ModalOverflow, ModalProps } from '@mui/joy'
import React from 'react'

export interface ModalCoreProps extends Omit<ModalProps, 'children' | 'open' | 'onClose'> {
  children?:
    | React.ReactNode
    | React.FC<{
        close: () => void
      }>
  component?: React.FC<
    {
      onClick: React.MouseEventHandler<HTMLElement>
      onKeyDown: React.KeyboardEventHandler<HTMLElement>
    } & Pick<React.HTMLAttributes<HTMLElement>, 'role'>
  >
  disableBackdropClickClose?: boolean
  disabled?: boolean
  layout?: ModalDialogProps['layout']
  loading?: boolean
  onClose?: () => void
  onOpen?: () => void
}

export interface ModalCoreRef {
  openToggle: (payload?: boolean) => void
}

const ModalCore: React.ForwardRefRenderFunction<ModalCoreRef | undefined, ModalCoreProps> = (
  { children, component: Component, disabled, onClose, onOpen, loading, disableBackdropClickClose, className, layout, ...props },
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

  // 避免按键在内部按下而在外部抬起而意外关闭窗口
  const pointerDownTarget = React.useRef<HTMLElement>()

  return (
    <>
      {Component && (
        <Component
          role="button"
          onClick={event => {
            event.stopPropagation()
            handleOpenToggle(true)
          }}
          onKeyDown={event => {
            if (event.code != 'Enter') return
            event.stopPropagation()
            handleOpenToggle(true)
          }}
        />
      )}
      <Modal
        open={isOpen}
        onClose={(event, reason) => {
          if (reason == 'backdropClick') {
            if (disableBackdropClickClose) return
            if (Reflect.get(event, 'target') != pointerDownTarget.current) return
          }
          handleClose()
        }}
        {...props}
      >
        <ModalOverflow
          onClick={event => event.stopPropagation()}
          onKeyDown={event => {
            if (event.code == 'Escape') return
            event.stopPropagation()
          }}
          onPointerDown={event => {
            event.stopPropagation()
            pointerDownTarget.current = event.target as HTMLElement
          }}
        >
          <ModalDialog className={cn('relative p-5', className)} layout={layout}>
            {loading && <LinearProgress className="absolute inset-x-1 top-0" />}
            {typeof children == 'function' ? children({ close: handleClose }) : children}
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </>
  )
}

export default React.forwardRef(ModalCore)
