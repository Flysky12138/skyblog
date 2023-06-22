import { POST } from '@/app/api/dashboard/friend-links/route'
import ModalCore, { ModalCoreProps, ModalCoreRef } from '@/components/modal/ModalCore'
import { Button, FormControl, FormLabel, Input } from '@mui/joy'
import React from 'react'
import { useImmer } from 'use-immer'

interface ModalFormProps extends Pick<ModalCoreProps, 'component'> {
  onSubmit: (payload: POST['body']) => Promise<void>
  value?: POST['body']
}

const defaultValue: POST['body'] = {
  name: '',
  url: ''
}

export default function ModalForm({ component: Component, value, onSubmit }: ModalFormProps) {
  const [form, setForm] = useImmer(value || defaultValue)

  const modalRef = React.useRef<ModalCoreRef>()

  return (
    <ModalCore ref={modalRef} className="flex flex-col gap-y-5" component={Component} onOpen={() => setForm(value || defaultValue)}>
      <FormControl required>
        <FormLabel>名字</FormLabel>
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
        <FormLabel>描述</FormLabel>
        <Input
          value={form.subtitle || ''}
          onChange={event => {
            setForm(state => {
              state.subtitle = event.target.value || null
            })
          }}
        />
      </FormControl>
      <FormControl required>
        <FormLabel>链接</FormLabel>
        <Input
          value={form.url}
          onChange={event => {
            setForm(state => {
              state.url = event.target.value
            })
          }}
        />
      </FormControl>
      <Button
        className="mt-3"
        disabled={!form.name || !form.url}
        onClick={async () => {
          await onSubmit(form)
          modalRef.current?.openToggle()
        }}
      >
        {value ? '保存' : '更新'}
      </Button>
    </ModalCore>
  )
}
