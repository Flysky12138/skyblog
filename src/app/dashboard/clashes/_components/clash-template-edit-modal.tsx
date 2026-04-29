'use client'

import { Treaty } from '@elysiajs/eden'
import { zodResolver } from '@hookform/resolvers/zod'
import { pick } from 'es-toolkit'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { ClashTemplateCreateBodySchema, ClashTemplateCreateBodyType } from '@/app/api/[[...elysia]]/dashboard/clashes/templates/model'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { MonacoEditor } from '@/components/monaco-editor'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui-overwrite/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Badge } from '@/components/ui/badge'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { rpc } from '@/lib/http/rpc'

import { getVariablesNames } from './utils'

interface ClashTemplateEditModalProps extends React.PropsWithChildren {
  value?: Treaty.Data<typeof rpc.dashboard.clashes.templates.get>[number]
  onSubmit: (payload: ClashTemplateCreateBodyType) => Promise<void>
}

export function ClashTemplateEditModal({ children, value, onSubmit }: ClashTemplateEditModalProps) {
  const form = useForm({
    defaultValues: { content: '', name: '' },
    resolver: zodResolver(ClashTemplateCreateBodySchema)
  })
  const [content] = form.watch(['content'])

  const variables = React.useMemo(() => getVariablesNames(content), [content])

  return (
    <Dialog
      onOpenChange={isOpen => {
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
          <DialogTitle>通用模板</DialogTitle>
          <DialogDescription>自定义 Clash 客户端订阅内容的模板，使用 {`#{name}`} 定义变量</DialogDescription>
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
                      language="yaml"
                      options={{
                        lineNumbersMinChars: 3
                      }}
                      originalValue={value?.content}
                      value={field.value}
                      onChange={field.onChange}
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
                  <FieldLabel aria-required htmlFor={field.name}>
                    名称
                  </FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} autoComplete="off" id={field.name} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <DisplayByConditional condition={variables.length > 0}>
              <Field>
                <FieldLabel>变量</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {variables.map((key, index) => (
                    <Badge key={key + index} variant="secondary">
                      {key}
                    </Badge>
                  ))}
                </div>
              </Field>
            </DisplayByConditional>
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
