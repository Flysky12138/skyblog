'use client'

import { Treaty } from '@elysiajs/eden'
import { zodResolver } from '@hookform/resolvers/zod'
import { pick } from 'es-toolkit'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { FriendCreateBodySchema, FriendCreateBodyType } from '@/app/api/[[...elysia]]/dashboard/friends/model'
import { Button } from '@/components/ui-overwrite/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { rpc } from '@/lib/http/rpc'

interface FriendEditModalProps {
  children: React.ReactElement
  value?: Treaty.Data<typeof rpc.dashboard.friends.get>[number]
  onSubmit: (payload: FriendCreateBodyType) => Promise<void>
}

export function FriendEditModal({ children, value, onSubmit }: FriendEditModalProps) {
  const form = useForm({
    defaultValues: { description: null, name: '', siteUrl: '' },
    resolver: zodResolver(FriendCreateBodySchema)
  })

  return (
    <Dialog
      onOpenChange={isOpen => {
        form.reset()
        if (!isOpen) return
        if (value) {
          form.setValues(pick(value, ['description', 'name', 'siteUrl']))
        }
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>友链</DialogTitle>
          <DialogDescription>填写友链信息</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel aria-required htmlFor={field.name}>
                    名称
                  </FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} autoComplete="off" id={field.name} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="siteUrl"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel aria-required htmlFor={field.name}>
                    链接
                  </FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} autoComplete="off" id={field.name} type="url" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>描述</FieldLabel>
                  <Textarea
                    className="min-h-24"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    id={field.name}
                    value={field.value ?? undefined}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button loading={form.formState.isSubmitting} type="submit">
                {value ? '保存' : '更新'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
