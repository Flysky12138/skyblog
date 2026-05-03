'use client'

import { Treaty } from '@elysiajs/eden'
import { zodResolver } from '@hookform/resolvers/zod'
import { pick } from 'es-toolkit'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { CategoryCreateBodySchema, CategoryCreateBodyType } from '@/app/api/[[...elysia]]/dashboard/posts/categories/model'
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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { rpc } from '@/lib/http/rpc'

interface PostCategoryEditModalProps {
  children: React.ReactElement
  value?: Treaty.Data<typeof rpc.dashboard.posts.categories.get>[number]
  onSubmit: (payload: CategoryCreateBodyType) => Promise<void>
}

export function PostCategoryEditModal({ children, value, onSubmit }: PostCategoryEditModalProps) {
  const form = useForm({
    defaultValues: { name: '' },
    resolver: zodResolver(CategoryCreateBodySchema)
  })

  return (
    <Dialog
      onOpenChange={isOpen => {
        form.reset()
        if (!isOpen) return
        if (value) {
          form.setValues(pick(value, ['name']))
        }
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>分类</DialogTitle>
          <DialogDescription>编辑分类信息</DialogDescription>
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
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" />}>取消</DialogClose>
            <Button className="min-w-32" loading={form.formState.isSubmitting} type="submit">
              {value ? '保存' : '更新'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
