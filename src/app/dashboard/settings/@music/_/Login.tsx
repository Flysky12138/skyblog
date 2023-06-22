'use client'

import ModalCore from '@/components/modal/ModalCore'
import { CustomFetch } from '@/lib/server/fetch'
import { Toast } from '@/lib/toast'
import { Button, FormControl, FormHelperText, FormLabel, Input } from '@mui/joy'
import React from 'react'
import { toast } from 'sonner'
import { useImmer } from 'use-immer'

const getCaptcha = async (phone: string) => {
  return await CustomFetch(`/api/dashboard/music/neteasecloud/login/captcha?phone=${phone}`)
}
const login = async (phone: string, password_captcha: string) => {
  return await CustomFetch(`/api/dashboard/music/neteasecloud/login/cellphone?phone=${phone}&password_captcha=${password_captcha}`)
}

interface LoginProps {
  onSuccess: () => void
}

export default function Login({ onSuccess }: LoginProps) {
  const [form, setForm] = useImmer({ password_captcha: '', phone: '' })

  const [loading, setLoading] = React.useState(false)

  return (
    <ModalCore
      component={props => (
        <Button className="my-px" size="sm" variant="outlined" {...props}>
          登录
        </Button>
      )}
      loading={loading}
    >
      {({ close }) => (
        <div className="space-y-3">
          <FormControl required>
            <FormLabel>手机号({form.phone.length})</FormLabel>
            <Input
              name="phone"
              slotProps={{
                input: {
                  maxLength: 11
                }
              }}
              value={form.phone}
              onChange={event => {
                setForm(state => {
                  state.phone = event.target.value
                })
              }}
              onKeyUp={async event => {
                if (event.code != 'Enter') return
                if (!/^1\d{10}$/.test(form.phone)) {
                  toast.error('手机号验证错误')
                  return
                }
                await toast.promise(getCaptcha(form.phone), {
                  error: '获取验证码失败',
                  loading: '获取验证码中',
                  success: '已发送验证码'
                })
              }}
            />
            <FormHelperText>回车可获取验证码</FormHelperText>
          </FormControl>
          <FormControl required>
            <FormLabel>密码 / 验证码</FormLabel>
            <Input
              name="password_captcha"
              type={/^\w{5,}$/.test(form.password_captcha) ? 'password' : 'text'}
              value={form.password_captcha}
              onChange={event => {
                setForm(state => {
                  state.password_captcha = event.target.value
                })
              }}
            />
          </FormControl>
          <Button
            fullWidth
            className="!mt-7"
            disabled={!form.phone || !form.password_captcha || loading}
            onClick={async () => {
              setLoading(true)
              try {
                await Toast(login(form.phone, form.password_captcha), '登陆成功')
                onSuccess()
                close()
              } catch (error) {}
              setLoading(false)
            }}
          >
            登录
          </Button>
        </div>
      )}
    </ModalCore>
  )
}
