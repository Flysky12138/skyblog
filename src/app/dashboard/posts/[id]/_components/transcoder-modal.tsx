'use client'

import React from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Textarea } from '@/components/ui/textarea'

interface TranscoderModalProps extends React.PropsWithChildren {}

export function TranscoderModal({ children }: TranscoderModalProps) {
  const [unicode, setUnicode] = React.useState('')
  const [base64, setBase64] = React.useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-5xl"
        onCloseAutoFocus={event => {
          event.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>转码器</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Textarea
            className="min-h-48 sm:min-h-96"
            placeholder="unicode"
            value={unicode}
            onChange={event => {
              const { value } = event.target
              React.startTransition(() => {
                setUnicode(value)
                setBase64(btoa(value))
              })
            }}
          />
          <Textarea
            className="min-h-48 sm:min-h-96"
            placeholder="base64"
            value={base64}
            onChange={event => {
              const { value } = event.target
              React.startTransition(() => {
                setBase64(value)
                setUnicode(atob(value))
              })
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
