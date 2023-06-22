import { POST, PUT } from '@/app/api/dashboard/clash/route'
import { GET } from '@/app/api/dashboard/clash/template/route'
import ModalCore, { ModalCoreProps } from '@/components/modal/ModalCore'
import MonacoEditor from '@/components/monaco-editor'
import { yamlConfig } from '@/components/monaco-editor/language/yaml'
import { SWR_KEY } from '@/lib/constants'
import { getVariableNames, replaceTextWithObjectValues } from '@/lib/parser/string'
import { Button, FormControl, FormHelperText, FormLabel, Input, Option, Select } from '@mui/joy'
import dayjs from 'dayjs'
import React from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

interface ModalClashProps extends Pick<ModalCoreProps, 'component'> {
  onSubmit: (payload: NonNullable<ModalClashProps['value']>) => Promise<void>
  value?: Pick<POST['body'], keyof PUT['body']>
}

export default function ModalClash({ component: Component, value, onSubmit }: ModalClashProps) {
  const [form, setForm] = useImmer<NonNullable<ModalClashProps['value']>>({
    clashTemplateId: null,
    content: '',
    name: '',
    subtitle: '',
    variables: {}
  })

  const [oldContent, setOldContent] = React.useState('')

  // 响应式模版内容，从缓存中快速获取
  const { data: clashTemplates, isLoading } = useSWR<GET['return']>(SWR_KEY.CLASH_TEMPLATES)

  const currentSelectClashTemplate = React.useMemo(() => clashTemplates?.find(it => it.id == form.clashTemplateId), [form.clashTemplateId, clashTemplates])

  const selectClashTemplateVariables = React.useMemo<string[]>(() => {
    if (!currentSelectClashTemplate) return []
    return getVariableNames(currentSelectClashTemplate.content)
  }, [currentSelectClashTemplate])

  const mergeContent = React.useMemo(
    () => replaceTextWithObjectValues(currentSelectClashTemplate?.content, form.variables, false),
    [currentSelectClashTemplate, form.variables]
  )

  const canSubmit = React.useMemo(() => {
    if (!form.clashTemplateId) return form.name && form.content
    return form.name && Object.values(form.variables).reduce((pre, cur) => pre && cur, true)
  }, [form])

  return (
    <ModalCore
      className="w-full max-w-2xl"
      component={Component}
      onOpen={() => {
        if (!value) return
        setForm(value)
        setOldContent(value.content)
      }}
    >
      {({ close }) => (
        <>
          <FormControl required>
            <FormLabel>名称</FormLabel>
            <Input
              endDecorator={
                <Button
                  variant="soft"
                  onClick={() => {
                    setForm(state => {
                      state.name = dayjs().format('YYMMDDHHmmss')
                    })
                  }}
                >
                  随机
                </Button>
              }
              value={form.name}
              onChange={event => {
                setForm(state => {
                  state.name = event.target.value
                })
              }}
            />
            <FormHelperText>作为订阅用户的配置文件名</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>描述</FormLabel>
            <Input
              value={form.subtitle || ''}
              onChange={event => {
                setForm(state => {
                  state.subtitle = event.target.value
                })
              }}
            />
          </FormControl>
          {selectClashTemplateVariables.length > 0 && (
            <FormControl required>
              <FormLabel>填充项</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                {selectClashTemplateVariables.map(key => (
                  <FormControl key={key}>
                    <Input
                      className="w-full"
                      startDecorator={key}
                      value={Reflect.get(form.variables, key) || ''}
                      onChange={event => {
                        setForm(state => {
                          Reflect.set(state.variables, key, event.target.value)
                        })
                      }}
                    />
                  </FormControl>
                ))}
              </div>
            </FormControl>
          )}
          <FormControl required>
            <FormLabel>内容</FormLabel>
            <MonacoEditor
              code={form.clashTemplateId ? mergeContent : form.content}
              height="calc(100vh - 200px)"
              oldCode={form.clashTemplateId ? currentSelectClashTemplate?.content : oldContent}
              options={{
                lineNumbersMinChars: 3,
                readOnly: form.clashTemplateId != null
              }}
              toolbarRender={({ Space }) => (
                <>
                  <Space />
                  <Select
                    disabled={clashTemplates?.length == 0 || isLoading}
                    size="sm"
                    value={form.clashTemplateId}
                    onChange={(_, id) =>
                      setForm(state => {
                        state.clashTemplateId = id
                      })
                    }
                  >
                    <Option value={null}>自定义</Option>
                    {clashTemplates?.map(({ id, name }) => (
                      <Option key={id} value={id}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                </>
              )}
              onChange={payload => {
                setForm(state => {
                  state.content = payload || ''
                })
              }}
              {...yamlConfig}
            />
          </FormControl>
          <Button
            fullWidth
            className="mt-3"
            disabled={!canSubmit}
            size="lg"
            onClick={async () => {
              await onSubmit(form)
              close()
            }}
          >
            {value ? '更新' : '保存'}
          </Button>
        </>
      )}
    </ModalCore>
  )
}
