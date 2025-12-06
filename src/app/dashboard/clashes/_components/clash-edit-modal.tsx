'use client'

import { Treaty } from '@elysiajs/eden'
import dayjs from 'dayjs'
import { isEqual, pick, pickBy } from 'es-toolkit'
import React from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { ClashCreateBodyType } from '@/app/api/[[...elysia]]/dashboard/clashes/model'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { MonacoEditor } from '@/components/monaco-editor'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui-overwrite/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { ButtonGroup } from '@/components/ui/button-group'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { rpc, unwrap } from '@/lib/http/rpc'
import { getVariablesNames, replaceVariables } from '@/lib/parser/string'

import { SWR_KEY_CLASH_TEMPLATES } from './utils'

interface ClashEditModalProps extends React.PropsWithChildren {
  value?: Treaty.Data<typeof rpc.dashboard.clashes.get>[number]
  onSubmit: (payload: ClashCreateBodyType) => Promise<void>
}

export function ClashEditModal({ children, value, onSubmit }: ClashEditModalProps) {
  const [open, setOpen] = React.useState(false)

  const [form, setForm] = useImmer<ClashCreateBodyType>({
    content: '',
    description: '',
    name: '',
    templateId: null,
    variables: {}
  })

  const isUseTemplate = !!form.templateId

  // 模版内容，可从缓存中快速获取
  const { data: clashTemplates, isLoading } = useSWR(SWR_KEY_CLASH_TEMPLATES, () => rpc.dashboard.clashes.templates.get().then(unwrap), {
    fallbackData: []
  })

  // 选中的模板
  const selectedClashTemplate = React.useMemo(() => {
    return clashTemplates?.find(it => it.id == form.templateId)
  }, [form.templateId, clashTemplates])
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
    if (isUseTemplate) {
      return form.name && isEqual(selectedClashTemplateVariables, Object.keys(pickBy(form.variables, Boolean)))
    }
    return form.name && form.content
  }, [form.content, form.name, form.variables, isUseTemplate, selectedClashTemplateVariables])

  const [isPending, startTransition] = React.useTransition()

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen)
        if (!isOpen) return
        if (value) {
          setForm(pick(value, ['content', 'description', 'name', 'templateId', 'variables']))
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-7xl lg:h-[calc(100vh-120px)]">
        <DialogHeader>
          <DialogTitle>共享配置</DialogTitle>
          <DialogDescription>自定义 Clash 客户端订阅内容</DialogDescription>
        </DialogHeader>

        <div className="grid h-full gap-6 lg:grid-cols-[1fr_400px]">
          <Card asChild className="rounded-sm not-lg:h-80">
            <MonacoEditor
              isDiffMode={isUseTemplate}
              language="yaml"
              options={{
                readOnly: isUseTemplate
              }}
              originalValue={isUseTemplate ? selectedClashTemplate?.content : value?.content}
              value={isUseTemplate ? realTemplateContent : form.content}
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
              <ButtonGroup>
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm(draft => {
                      draft.name = dayjs().format('YYYYMMDDHHmmss')
                    })
                  }}
                >
                  随机
                </Button>
              </ButtonGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="description">描述</FieldLabel>
              <Input
                autoComplete="off"
                id="description"
                value={form.description || ''}
                onChange={event => {
                  setForm(draft => {
                    draft.description = event.target.value
                  })
                }}
              />
            </Field>
            <Field>
              <FieldLabel>模板</FieldLabel>
              <Select
                disabled={clashTemplates?.length == 0 || isLoading}
                value={form.templateId || 'null'}
                onValueChange={id => {
                  setForm(draft => {
                    draft.templateId = id == 'null' ? null : id
                    draft.variables = {} // 清空变量字典，因为这和模板有关
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
            </Field>
            <DisplayByConditional condition={selectedClashTemplateVariables.length > 0}>
              <Field>
                <FieldLabel aria-required>变量</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  {selectedClashTemplateVariables.map((key, index) => (
                    <Input
                      key={key + index}
                      autoComplete="off"
                      className="w-full"
                      placeholder={key}
                      value={form.variables[key] || undefined}
                      onChange={event => {
                        setForm(draft => {
                          draft.variables[key] = event.target.value
                        })
                      }}
                    />
                  ))}
                </div>
              </Field>
            </DisplayByConditional>
            <Button
              disabled={!canSubmit}
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
