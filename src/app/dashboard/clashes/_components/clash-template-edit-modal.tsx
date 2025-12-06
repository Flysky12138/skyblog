'use client'

import { Treaty } from '@elysiajs/eden'
import { pick } from 'es-toolkit'
import React from 'react'
import { useImmer } from 'use-immer'

import { ClashTemplateCreateBodyType } from '@/app/api/[[...elysia]]/dashboard/clashes/templates/model'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { MonacoEditor } from '@/components/monaco-editor'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui-overwrite/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Badge } from '@/components/ui/badge'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { rpc } from '@/lib/http/rpc'
import { getVariablesNames } from '@/lib/parser/string'

interface ClashTemplateEditModalProps extends React.PropsWithChildren {
  value?: Treaty.Data<typeof rpc.dashboard.clashes.templates.get>[number]
  onSubmit: (payload: ClashTemplateCreateBodyType) => Promise<void>
}

export function ClashTemplateEditModal({ children, value, onSubmit }: ClashTemplateEditModalProps) {
  const [open, setOpen] = React.useState(false)

  const [form, setForm] = useImmer<ClashTemplateCreateBodyType>({
    content: '',
    name: ''
  })

  const variables = React.useMemo(() => getVariablesNames(form.content), [form.content])

  const [isPending, startTransition] = React.useTransition()

  return (
    <Dialog
      open={open}
      onOpenChange={isopen => {
        setOpen(isopen)
        if (!isopen) return
        if (value) {
          setForm(pick(value, ['name', 'content']))
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-7xl lg:h-[calc(100vh-120px)]">
        <DialogHeader>
          <DialogTitle>通用模板</DialogTitle>
          <DialogDescription>自定义 Clash 客户端订阅内容的模板，使用 {`#{name}`} 定义变量</DialogDescription>
        </DialogHeader>
        <div className="grid h-full gap-6 lg:grid-cols-[1fr_400px]">
          <Card asChild className="rounded-sm not-lg:h-80">
            <MonacoEditor
              language="yaml"
              options={{
                lineNumbersMinChars: 3
              }}
              originalValue={value?.content}
              value={form.content}
              onChange={payload => {
                setForm(draft => {
                  draft.content = payload
                })
              }}
            />
          </Card>
          <FieldGroup>
            <Field>
              <FieldLabel aria-required htmlFor="name">
                名称
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
            <Button
              disabled={!form.name || !form.content}
              loading={isPending}
              onClick={() => {
                startTransition(async () => {
                  await onSubmit(form)
                  setOpen(false)
                })
              }}
            >
              {value ? '更新' : '保存'}
            </Button>
          </FieldGroup>
        </div>
      </DialogContent>
    </Dialog>
  )
}
