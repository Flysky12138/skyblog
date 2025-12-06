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
    description: null,
    name: '',
    siteUrl: ''
  })

  const disable = !form.name || !form.siteUrl

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen)
        if (!isOpen) {
          return
        }
        if (value) {
          setForm(value)
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>友链</DialogTitle>
          <DialogDescription>填写友链信息</DialogDescription>
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
                setForm(draft => {
                  draft.name = event.target.value
                })
              }}
            />
          </Field>
          <Field>
            <FieldLabel aria-required htmlFor="siteUrl">
              链接
            </FieldLabel>
            <Input
              autoComplete="off"
              id="siteUrl"
              type="url"
              value={form.siteUrl}
              onChange={event => {
                setForm(draft => {
                  draft.siteUrl = event.target.value
                })
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">描述</FieldLabel>
            <Textarea
              autoComplete="off"
              className="min-h-24"
              id="description"
              value={form.description || ''}
              onChange={event => {
                setForm(draft => {
                  draft.description = event.target.value || null
                })
              }}
            />
          </Field>
          <Button
            disabled={disable}
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
