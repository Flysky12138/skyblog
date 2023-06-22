'use client'

import dayjs from 'dayjs'
import { isEqual, pickBy } from 'es-toolkit'
import React from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { POST, PUT } from '@/app/api/dashboard/clash/route'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { MonacoEditor } from '@/components/monaco-editor'
import { yamlClashConfig } from '@/components/monaco-editor/languages/yaml-clash'
import { Card } from '@/components/static/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomRequest } from '@/lib/http/request'
import { getVariablesNames, replaceVariables } from '@/lib/parser/string'

import { SWR_KEY_CLASH_TEMPLATES } from './clash-template-table'

interface ClashDetailProps extends React.PropsWithChildren {
  value?: Pick<POST['body'], keyof PUT['body']>
  onSubmit: (payload: NonNullable<ClashDetailProps['value']>) => Promise<void>
}

export const ClashDetail = ({ children, value, onSubmit }: ClashDetailProps) => {
  const [open, setOpen] = React.useState(false)

  const [form, setForm] = useImmer<NonNullable<ClashDetailProps['value']>>({
    clashTemplateId: null,
    content: '',
    name: '',
    subtitle: '',
    variables: {}
  })

  const isUseTemplate = !!form.clashTemplateId

  // 模版内容，可从缓存中快速获取
  const { data: clashTemplates, isLoading } = useSWR(SWR_KEY_CLASH_TEMPLATES, () => CustomRequest('GET /api/dashboard/clash/template', {}), {
    fallbackData: []
  })

  // 选中的模板
  const selectedClashTemplate = React.useMemo(() => {
    return clashTemplates?.find(it => it.id == form.clashTemplateId)
  }, [form.clashTemplateId, clashTemplates])
  // 选中的模板中的变量名
  const selectedClashTemplateVariables = React.useMemo(() => {
    return selectedClashTemplate ? getVariablesNames(selectedClashTemplate.content) : []
  }, [selectedClashTemplate])
  // 赋值后的模板内容
  const realTemplateContent = React.useMemo(() => {
    return replaceVariables(selectedClashTemplate?.content, form.variables, false)
  }, [selectedClashTemplate, form.variables])

  // 可保存
  const canSubmit = React.useMemo(() => {
    if (isUseTemplate) return form.name && isEqual(selectedClashTemplateVariables, Object.keys(pickBy(form.variables, Boolean)))
    return form.name && form.content
  }, [form.content, form.name, form.variables, isUseTemplate, selectedClashTemplateVariables])

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
      <DialogContent className="h-[calc(100vh-40px)] max-w-7xl">
        <DialogHeader>
          <DialogTitle>共享配置</DialogTitle>
          <DialogDescription>自定义 Clash 客户端订阅内容</DialogDescription>
        </DialogHeader>
        <div className="grid h-full grid-cols-[1fr_400px] gap-6">
          <Card className="overflow-hidden">
            <MonacoEditor
              code={isUseTemplate ? realTemplateContent : form.content}
              diffMode={isUseTemplate}
              oldCode={isUseTemplate ? selectedClashTemplate?.content : value?.content}
              options={{
                readOnly: isUseTemplate
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
              <div className="flex gap-2">
                <Input
                  value={form.name}
                  onChange={event => {
                    setForm(state => {
                      state.name = event.target.value
                    })
                  }}
                />
                <Button
                  onClick={() => {
                    setForm(state => {
                      state.name = dayjs().format('YYYYMMDDHHmmss')
                    })
                  }}
                >
                  随机
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>描述</Label>
              <Input
                value={form.subtitle || ''}
                onChange={event => {
                  setForm(state => {
                    state.subtitle = event.target.value
                  })
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>模板</Label>
              <Select
                disabled={clashTemplates?.length == 0 || isLoading}
                value={form.clashTemplateId || 'null'}
                onValueChange={id => {
                  setForm(state => {
                    state.clashTemplateId = id == 'null' ? null : id
                    state.variables = {} // 清空变量字典，因为这和模板有关
                  })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择模板" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">自定义</SelectItem>
                  {clashTemplates?.map(({ id, name }) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DisplayByConditional condition={selectedClashTemplateVariables.length > 0}>
              <div className="flex flex-col gap-2">
                <Label aria-required>变量</Label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedClashTemplateVariables.map((key, index) => (
                    <Input
                      key={key + index}
                      className="w-full"
                      placeholder={key}
                      value={form.variables[key] || undefined}
                      onChange={event => {
                        setForm(state => {
                          state.variables[key] = event.target.value
                        })
                      }}
                    />
                  ))}
                </div>
              </div>
            </DisplayByConditional>
            <Button
              className="mt-3"
              disabled={!canSubmit}
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
