import { POST, PUT } from '@/app/api/dashboard/clash/template/route'
import Card from '@/components/layout/Card'
import ModalCore, { ModalCoreProps } from '@/components/modal/ModalCore'
import MonacoEditor from '@/components/monaco-editor'
import { yamlConfig } from '@/components/monaco-editor/language/yaml'
import { getVariableNames } from '@/lib/parser/string'
import { Button, Chip, FormControl, FormLabel, Input } from '@mui/joy'
import React from 'react'
import { useImmer } from 'use-immer'

interface ModalTemplateProps extends Pick<ModalCoreProps, 'component'> {
  onSubmit: (payload: NonNullable<ModalTemplateProps['value']>) => Promise<void>
  value?: Pick<POST['body'], keyof PUT['body']>
}

export default function ModalTemplate({ component: Component, value, onSubmit }: ModalTemplateProps) {
  const [form, setForm] = useImmer<NonNullable<ModalTemplateProps['value']>>({
    content: '',
    name: ''
  })

  const [oldContent, setOldContent] = React.useState('')

  const keys = React.useMemo(() => getVariableNames(form.content), [form.content])

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
              value={form.name}
              onChange={event => {
                setForm(state => {
                  state.name = event.target.value
                })
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>动态字段</FormLabel>
            <Card className="box-content flex min-h-6 flex-wrap gap-2 rounded-lg p-2">
              {keys.map(key => (
                <Chip key={key} className="rounded-md" color="primary">
                  {key}
                </Chip>
              ))}
            </Card>
          </FormControl>
          <FormControl required>
            <FormLabel>内容</FormLabel>
            <MonacoEditor
              code={form.content}
              height="calc(100vh - 200px)"
              oldCode={oldContent}
              options={{
                lineNumbersMinChars: 3
              }}
              toolbarRender={({ Space }) => <Space />}
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
            disabled={!form.name || !form.content}
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
