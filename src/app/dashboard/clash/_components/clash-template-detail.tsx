'use client'

import React from 'react'
import { useImmer } from 'use-immer'

import { POST, PUT } from '@/app/api/dashboard/clash/template/route'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { MonacoEditor } from '@/components/monaco-editor'
import { yamlClashConfig } from '@/components/monaco-editor/languages/yaml-clash'
import { Card } from '@/components/static/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
      <DialogContent className="h-[calc(100vh-40px)] max-w-7xl">
        <DialogHeader>
          <DialogTitle>通用模板</DialogTitle>
          <DialogDescription>自定义 Clash 客户端订阅内容的模板。使用 {`#{name}`} 定义变量。</DialogDescription>
        </DialogHeader>
        <div className="grid h-full grid-cols-[1fr_400px] gap-6">
          <Card className="overflow-hidden">
            <MonacoEditor
              code={form.content}
              oldCode={value?.content}
              options={{
                lineNumbersMinChars: 3
              }}
              onChange={payload => {
                setForm(state => {
                  state.content = payload || ''
                })
              }}
              {...yamlClashConfig}
            />
          </Card>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label aria-required>名称</Label>
              <Input
                value={form.name}
                onChange={event => {
                  setForm(state => {
                    state.name = event.target.value
                  })
                }}
              />
            </div>
            <DisplayByConditional condition={variables.length > 0}>
              <div className="flex flex-col gap-2">
                <Label>变量</Label>
                <div className="flex flex-wrap gap-2">
                  {variables.map((key, index) => (
                    <span key={key + index} className="bg-muted rounded-md px-1.5 py-1 font-semibold">
                      {key}
                    </span>
                  ))}
                </div>
              </div>
            </DisplayByConditional>
            <Button
              className="mt-3"
              disabled={!form.name || !form.content}
              onClick={async () => {
                await onSubmit(form)
                setOpen(false)
              }}
            >
              {value ? '更新' : '保存'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
