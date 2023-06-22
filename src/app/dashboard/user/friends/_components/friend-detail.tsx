'use client'

import React from 'react'
import { useImmer } from 'use-immer'

import { POST } from '@/app/api/dashboard/user/friends/route'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
          <DialogDescription>友链表单</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label aria-required>名字</Label>
            <Input
              value={form.name}
              onChange={event => {
                setForm(state => {
                  state.name = event.target.value
                })
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label aria-required>链接</Label>
            <Input
              type="url"
              value={form.url}
              onChange={event => {
                setForm(state => {
                  state.url = event.target.value
                })
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>描述</Label>
            <Input
              value={form.subtitle || ''}
              onChange={event => {
                setForm(state => {
                  state.subtitle = event.target.value || null
                })
              }}
            />
          </div>
          <Button
            className="mt-3"
            disabled={!form.name || !form.url}
            onClick={async () => {
              await onSubmit(form)
              setOpen(false)
            }}
          >
            {value ? '保存' : '更新'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
