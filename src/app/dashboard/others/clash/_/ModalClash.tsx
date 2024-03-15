import { ClashPostRequest } from '@/app/api/dashboard/clash/route'
import ModalCore, { ModalCoreProps } from '@/components/modal/ModalCore'
import MonacoEditor from '@/components/monaco-editor'
import { yamlConfig } from '@/components/monaco-editor/yaml'
import { Button, FormControl, FormLabel, Input } from '@mui/joy'
import dayjs from 'dayjs'
import React from 'react'
import { useImmer } from 'use-immer'

interface ModalClashProps extends Pick<ModalCoreProps, 'component'> {
  onSubmit: (payload: ClashPostRequest) => Promise<void>
  value?: Pick<ClashPostRequest, 'content' | 'name' | 'subtitle'>
}

export default function ModalClash({ component: Component, value, onSubmit }: ModalClashProps) {
  const [form, setForm] = useImmer<NonNullable<ModalClashProps['value']>>({
    content: '',
    name: '',
    subtitle: ''
  })

  const [oldContent, setOldContent] = React.useState('')

  return (
    <ModalCore
      className="w-full md:max-w-2xl"
      component={Component}
      onOpen={() => {
        setForm({ content: value?.content || '', name: value?.name || '', subtitle: value?.subtitle || '' })
        setOldContent(value?.content || '')
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
          <FormControl required>
            <FormLabel>内容</FormLabel>
            <MonacoEditor
              code={form.content}
              height="50vh"
              oldCode={oldContent}
              options={{
                lineNumbersMinChars: 3,
                minimap: { enabled: false }
              }}
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
