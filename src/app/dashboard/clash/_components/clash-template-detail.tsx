'use client'

import React from 'react'
import { useImmer } from 'use-immer'

import { POST, PUT } from '@/app/api/dashboard/clash/template/route'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { MonacoEditor } from '@/components/monaco-editor'
import { Card } from '@/components/static/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { getVariablesNames } from '@/lib/parser/string'

interface ClashTemplateDetailProps extends React.PropsWithChildren {
  value?: Pick<POST['body'], keyof PUT['body']>
  onSubmit: (payload: NonNullable<ClashTemplateDetailProps['value']>) => Promise<void>
}

export const ClashTemplateDetail = ({ children, value, onSubmit }: ClashTemplateDetailProps) => {
  const [open, setOpen] = React.useState(false)

  const [form, setForm] = useImmer<NonNullable<ClashTemplateDetailProps['value']>>({
    content: '',
    name: ''
  })

  const variables = React.useMemo(() => getVariablesNames(form.content), [form.content])

  return (
    <Dialog
      open={open}
      onOpenChange={isopen => {
        setOpen(isopen)
        if (!isopen) return
        if (value) {
          setForm(value)
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[calc(100vh-120px)] max-h-200 max-w-7xl">
        <DialogHeader>
          <DialogTitle>通用模板</DialogTitle>
          <DialogDescription>自定义 Clash 客户端订阅内容的模板，使用 {`#{name}`} 定义变量</DialogDescription>
        </DialogHeader>
        <div className="grid h-full grid-cols-[1fr_400px] gap-6">
          <Card asChild className="rounded-sm">
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
              size="lg"
              onClick={async () => {
                await onSubmit(form)
                setOpen(false)
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
