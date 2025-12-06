'use client'

import { Treaty } from '@elysiajs/eden'
import { pick } from 'es-toolkit'
import React from 'react'
import { useImmer } from 'use-immer'

import { CategoryCreateBodyType } from '@/app/api/[[...elysia]]/dashboard/posts/categories/model'
import { Button } from '@/components/ui-overwrite/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui-overwrite/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { rpc } from '@/lib/http/rpc'

interface PostCategoryEditModalProps extends React.PropsWithChildren {
  value?: Treaty.Data<typeof rpc.dashboard.posts.categories.get>[number]
  onSubmit: (payload: CategoryCreateBodyType) => Promise<void>
}

export function PostCategoryEditModal({ children, value, onSubmit }: PostCategoryEditModalProps) {
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = useImmer<CategoryCreateBodyType>({ name: '' })

  const [isPending, startTransition] = React.useTransition()

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen)
        if (!isOpen) return
        if (value) {
          setForm(pick(value, ['name']))
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>分类</DialogTitle>
          <DialogDescription>编辑分类信息</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">名称</FieldLabel>
            <Input
              autoComplete="off"
              id="name"
              value={typeof form.name == 'string' ? form.name : ''}
              onChange={event => {
                setForm(draft => {
                  draft.name = event.target.value
                })
              }}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button
            className="min-w-32"
            loading={isPending}
            onClick={() => {
              startTransition(async () => {
                await onSubmit(form)
                setOpen(false)
              })
            }}
          >
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
