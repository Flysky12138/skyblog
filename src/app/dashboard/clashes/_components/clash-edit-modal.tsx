'use client'

import { Treaty } from '@elysiajs/eden'
import { zodResolver } from '@hookform/resolvers/zod'
import { pick, toMerged } from 'es-toolkit'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import useSWR from 'swr'

import { ClashCreateBodySchema, ClashCreateBodyType } from '@/app/api/[[...elysia]]/dashboard/clashes/model'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { MonacoEditor } from '@/components/monaco-editor'
import { Button } from '@/components/ui-overwrite/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { ButtonGroup } from '@/components/ui/button-group'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { rpc, unwrap } from '@/lib/http/rpc'
import { randomString } from '@/lib/utils'

import { getVariablesNames, replaceVariables, SWR_KEY_CLASH_TEMPLATES } from './utils'

interface ClashEditModalProps {
  children: React.ReactElement
  value?: Treaty.Data<typeof rpc.dashboard.clashes.get>[number]
  onSubmit: (payload: ClashCreateBodyType) => Promise<void>
}

export function ClashEditModal({ children, value, onSubmit }: ClashEditModalProps) {
  const form = useForm({
    defaultValues: { content: '', description: '', name: '', templateId: null, variables: {} },
    resolver: zodResolver(ClashCreateBodySchema)
  })
  const [templateId, variables] = form.watch(['templateId', 'variables'])

  // 是否使用模板
  const isUseTemplate = !!templateId

  // 模版内容，可从缓存中快速获取
  const { data: clashTemplates, isLoading } = useSWR(SWR_KEY_CLASH_TEMPLATES, () => rpc.dashboard.clashes.templates.get().then(unwrap), {
    fallbackData: []
  })
  const items = [{ label: '自定义', value: 'custom' }].concat(clashTemplates.map(item => ({ label: item.name, value: item.id })))

  // 选中的模板
  const selectedClashTemplate = React.useMemo(() => clashTemplates?.find(it => it.id == templateId), [clashTemplates, templateId])
  // 选中的模板中的变量名
  const selectedClashTemplateVariableKeys = React.useMemo(() => getVariablesNames(selectedClashTemplate?.content), [selectedClashTemplate?.content])
  // 赋值后的模板内容
  const realTemplateContent = React.useMemo(() => {
    return replaceVariables(selectedClashTemplate?.content, variables, false)
  }, [selectedClashTemplate?.content, variables])

  React.useEffect(() => {
    if (!isUseTemplate) return
    form.setValue(
      'variables',
      selectedClashTemplateVariableKeys.reduce((pre, cur) => ({ ...pre, [cur]: variables[cur] ?? '' }), {})
    )
  }, [form, isUseTemplate, selectedClashTemplateVariableKeys, variables])

  return (
    <Dialog
      onOpenChange={isOpen => {
        form.reset()
        if (!isOpen) return
        if (value) {
          form.setValues(pick(value, ['content', 'description', 'name', 'templateId', 'variables']))
        }
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent className="max-w-7xl lg:h-[calc(100vh-120px)]">
        <DialogHeader>
          <DialogTitle>共享配置</DialogTitle>
          <DialogDescription>自定义 Clash 客户端订阅内容</DialogDescription>
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
                  <MonacoEditor
                    aria-invalid={fieldState.invalid}
                    className="not-lg:h-80"
                    id={field.name}
                    isDiffMode={isUseTemplate}
                    language="yaml"
                    options={{
                      readOnly: isUseTemplate
                    }}
                    originalValue={isUseTemplate ? selectedClashTemplate?.content : value?.content}
                    value={isUseTemplate ? realTemplateContent : field.value}
                    onChange={field.onChange}
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
                  <ButtonGroup>
                    <Input {...field} aria-invalid={fieldState.invalid} autoComplete="off" id={field.name} />
                    <Button
                      variant="outline"
                      onClick={event => {
                        event.preventDefault()
                        field.onChange(randomString(12))
                      }}
                    >
                      随机
                    </Button>
                  </ButtonGroup>
                  <FieldDescription>将作为订阅文件的文件名</FieldDescription>
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
                  <Input {...field} aria-invalid={fieldState.invalid} autoComplete="off" id={field.name} value={field.value ?? ''} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="templateId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>模板</FieldLabel>
                  <Select
                    disabled={clashTemplates?.length == 0 || isLoading}
                    items={items}
                    value={field.value || 'custom'}
                    onValueChange={id => {
                      field.onChange(id == 'custom' ? null : id)
                    }}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid} className="w-full" id={field.name}>
                      <SelectValue placeholder="选择模板" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {items.map(item => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <DisplayByConditional condition={selectedClashTemplateVariableKeys.length > 0}>
              <Controller
                control={form.control}
                name="variables"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel aria-required htmlFor={field.name}>
                      变量
                    </FieldLabel>
                    <div className="grid grid-cols-2 gap-3" id={field.name}>
                      {selectedClashTemplateVariableKeys.map((key, index) => (
                        <Input
                          key={key + index}
                          aria-invalid={fieldState.invalid && key in (fieldState.error ?? {})}
                          autoComplete="off"
                          className="aria-[invalid=false]:text-foreground w-full"
                          placeholder={key}
                          value={field.value[key] ?? ''}
                          onChange={event => {
                            field.onChange(toMerged(field.value, { [key]: event.target.value }))
                          }}
                        />
                      ))}
                    </div>
                    {fieldState.invalid && <FieldError errors={Object.values(fieldState.error ?? {}) as (typeof fieldState.error)[]} />}
                  </Field>
                )}
              />
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
