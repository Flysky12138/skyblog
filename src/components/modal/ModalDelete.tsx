'use client'

import { WarningRounded } from '@mui/icons-material'
import { Button, Typography } from '@mui/joy'
import React from 'react'
import ModalCore, { ModalCoreProps } from './ModalCore'

interface ModalDeleteProps extends Pick<ModalCoreProps, 'component' | 'onClose'> {
  description?: string
  onCancel?: () => void
  onSubmit: () => void
  title?: string
}

export default function ModalDelete({ component: Component, title, description, onClose, onCancel, onSubmit }: ModalDeleteProps) {
  const submitBtnRef = React.useRef<HTMLButtonElement>(null)

  return (
    <ModalCore component={Component} onClose={onClose} onOpen={() => setTimeout(() => submitBtnRef.current?.focus())}>
      {({ close }) => (
        <>
          <Typography level="h4" startDecorator={<WarningRounded color="error" />}>
            {title || '确认删除？'}
          </Typography>
          {description && (
            <Typography className="ml-[1.7rem] max-w-screen-md break-all" level="body-sm">
              {description}
            </Typography>
          )}
          <div className="mt-6 flex justify-end gap-x-4">
            <Button
              className="focus:s-outline"
              color="neutral"
              variant="plain"
              onClick={() => {
                onCancel?.()
                close()
              }}
            >
              取消
            </Button>
            <Button
              ref={submitBtnRef}
              className="focus:s-outline"
              color="danger"
              onClick={() => {
                onSubmit()
                close()
              }}
            >
              确认
            </Button>
          </div>
        </>
      )}
    </ModalCore>
  )
}
