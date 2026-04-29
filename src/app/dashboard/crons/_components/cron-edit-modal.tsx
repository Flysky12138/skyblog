'use client'

import { Treaty } from '@elysiajs/eden'
import { zodResolver } from '@hookform/resolvers/zod'
import { pick } from 'es-toolkit'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { CronCreateBodySchema, CronCreateBodyType } from '@/app/api/[[...elysia]]/dashboard/crons/model'
import { MonacoEditor } from '@/components/monaco-editor'
import { tsCronConfig } from '@/components/monaco-editor/languages/ts-cron'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui-overwrite/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { rpc } from '@/lib/http/rpc'

interface CronEditModalProps extends React.PropsWithChildren {
  value?: Treaty.Data<typeof rpc.dashboard.crons.get>[number]
  onSubmit: (payload: CronCreateBodyType) => Promise<void>
}

export function CronEditModal({ children, value, onSubmit }: CronEditModalProps) {
  const [open, setOpen] = React.useState(false)

  const form = useForm({
    defaultValues: { content: '', isEnabled: true, name: '' },
    resolver: zodResolver(CronCreateBodySchema)
  })

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen)
        form.reset()
        if (!isOpen) return
        if (value) {
          form.setValues(pick(value, ['content', 'name']))
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-7xl lg:h-[calc(100vh-120px)]">
        <DialogHeader>
          <DialogTitle>Cron 配置</DialogTitle>
          <DialogDescription>默认执行时间 08:00 UTC+8，可修改 vercel.json 后再部署</DialogDescription>
        </DialogHeader>
        <form className="grid h-full gap-6 lg:grid-cols-[1fr_400px]" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="content"
              render={({ field, fieldState }) => (
                <Field className="h-full" data-invalid={fieldState.invalid}>
                  <FieldLabel className="sr-only" htmlFor={field.name}>
                    内容
                  </FieldLabel>
                  <Card asChild className="rounded-sm not-lg:h-80">
                    <MonacoEditor
                      aria-invalid={fieldState.invalid}
                      id={field.name}
                      value={form.getValues('content')}
                      onChange={payload => {
                        form.setValue('content', payload)
                        field.onChange(payload)
                      }}
                      {...tsCronConfig}
                    />
                  </Card>
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
                  <FieldLabel htmlFor={field.name}>名称</FieldLabel>
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
