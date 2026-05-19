'use client'

import { Treaty } from '@elysiajs/eden'
import { zodResolver } from '@hookform/resolvers/zod'
import { MonacoEditor } from '@repo/monaco-editor'
import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog'
import { Field, FieldError, FieldGroup, FieldLabel, FieldTitle } from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import { pick } from 'es-toolkit'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { CronCreateBodySchema, CronCreateBodyType } from '@/app/api/[[...elysia]]/dashboard/crons/model'
import { rpc } from '@/lib/http/rpc'

import { onInit } from './utils'

interface CronEditModalProps {
  children: React.ReactElement
  value?: Treaty.Data<typeof rpc.dashboard.crons.get>[number]
  onSubmit: (payload: CronCreateBodyType) => Promise<void>
}

export function CronEditModal({ children, value, onSubmit }: CronEditModalProps) {
  const form = useForm({
    resolver: zodResolver(CronCreateBodySchema),
    defaultValues: {
      content: 'return async ({ now, WeCom }: Cron) => {\n  \n}\n',
      isEnabled: true,
      name: ''
    }
  })

  return (
    <Dialog
      onOpenChange={isOpen => {
        form.reset()
        if (!isOpen) return
        if (value) {
          form.setValues(pick(value, CronCreateBodySchema.keyof().options))
        }
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent className="max-w-7xl lg:h-[calc(100vh-120px)]" fullScreen="lg">
        <DialogHeader>
          <DialogTitle>Cron 配置</DialogTitle>
          <DialogDescription>默认执行时间 08:00 UTC+8，可修改 vercel.json 后再部署</DialogDescription>
        </DialogHeader>
        <form
          className="grid h-full gap-6 lg:grid-cols-[1fr_400px]"
          onSubmit={event => {
            void form.handleSubmit(onSubmit)(event)
          }}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="content"
              render={({ field, fieldState }) => (
                <Field className="h-full" data-invalid={fieldState.invalid}>
                  <FieldTitle className="sr-only">内容</FieldTitle>
                  <MonacoEditor
                    aria-invalid={fieldState.invalid}
                    className="not-lg:min-h-120"
                    id={field.name}
                    language="typescript"
                    options={{
                      minimap: {
                        enabled: false
                      }
                    }}
                    value={field.value}
                    onChange={field.onChange}
                    onInit={onInit}
                  />
                </Field>
              )}
            />
          </FieldGroup>
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
            <Field>
              <Button loading={form.formState.isSubmitting} type="submit">
                {value ? '更新' : '保存'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
