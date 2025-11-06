'use client'

import React from 'react'
import { useImmer } from 'use-immer'

import { POST } from '@/app/api/dashboard/user/friends/route'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface FriendDetailProps extends React.PropsWithChildren {
  value?: POST['body']
  onSubmit: (payload: POST['body']) => Promise<void>
}

export const FriendDetail = ({ children, value, onSubmit }: FriendDetailProps) => {
  const [open, setOpen] = React.useState(false)

  const [form, setForm] = useImmer<POST['body']>({
    name: '',
    subtitle: null,
    url: ''
  })

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen)
        if (!isOpen) return
        if (value) {
          setForm(value)
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>友链</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel aria-required htmlFor="name">
              名字
            </FieldLabel>
            <Input
              autoComplete="off"
              id="name"
              value={form.name}
              onChange={event => {
                setForm(state => {
                  state.name = event.target.value
                })
              }}
            />
          </Field>
          <Field>
            <FieldLabel aria-required htmlFor="url">
              链接
            </FieldLabel>
            <Input
              autoComplete="off"
              id="url"
              type="url"
              value={form.url}
              onChange={event => {
                setForm(state => {
                  state.url = event.target.value
                })
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="subtitle">描述</FieldLabel>
            <Textarea
              autoComplete="off"
              className="min-h-24"
              id="subtitle"
              value={form.subtitle || ''}
              onChange={event => {
                setForm(state => {
                  state.subtitle = event.target.value || null
                })
              }}
            />
          </Field>
          <Button
            disabled={!form.name || !form.url}
            onClick={async () => {
              await onSubmit(form)
              setOpen(false)
            }}
          >
            {value ? '保存' : '更新'}
          </Button>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  )
}
