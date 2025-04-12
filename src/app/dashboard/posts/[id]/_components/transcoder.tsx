import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

interface TranscoderProps extends React.PropsWithChildren {}

export const Transcoder = ({ children }: TranscoderProps) => {
  const [unicode, setUnicode] = React.useState('')
  const [base64, setBase64] = React.useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-3xl"
        onCloseAutoFocus={event => {
          event.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>转码器</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Textarea
            className="min-h-96"
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
            className="min-h-96"
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
