'use client'

import { WarningRounded } from '@mui/icons-material'
import { Button, Typography } from '@mui/joy'
import React from 'react'
import ModalCore, { ModalCorePropsType } from './ModalCore'

interface ModalDeletePropsType extends Pick<ModalCorePropsType, 'component' | 'onClose'> {
  onCancel?: () => void
  onSubmit: () => void
  title: string
}

export default function ModalDelete({ component: Component, title, onClose, onCancel, onSubmit }: ModalDeletePropsType) {
  const submitBtnRef = React.useRef<HTMLButtonElement>(null)

  return (
    <ModalCore component={Component} onClose={onClose} onOpen={() => setTimeout(() => submitBtnRef.current?.focus())}>
      {({ close }) => (
        <>
          <Typography level="h4" startDecorator={<WarningRounded color="error" />}>
            {title}
          </Typography>
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
