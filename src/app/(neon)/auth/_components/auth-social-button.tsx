'use client'

import React from 'react'
import { toast } from 'sonner'

import Github from '@/assets/svg/github.svg'
import Google from '@/assets/svg/google.svg'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth/client'
import { toastPromise } from '@/lib/toast'

type Provider = Parameters<typeof authClient.signIn.social>[0]['provider']

export function AuthSocialButton() {
  const setLoading = React.useEffectEvent((event: React.MouseEvent<HTMLButtonElement>, disabled: boolean) => {
    const fieldset = event.currentTarget.closest('fieldset')
    if (!fieldset) return
    fieldset.inert = disabled
  })

  const handleLogin = React.useEffectEvent(async (event: React.MouseEvent<HTMLButtonElement>, provider: Provider) => {
    try {
      setLoading(event, true)
      const { error } = await authClient.signIn.social({ callbackURL: process.env.NEXT_PUBLIC_WEBSITE_URL, provider })
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      setLoading(event, false)
      toast.error((error as Error).message)
    }
  })

  const handleClick2 = React.useEffectEvent<typeof handleLogin>(async (...params) => {
    await toastPromise(handleLogin(...params), {
      loading: '登录中...',
      position: 'top-center',
      success: '登录成功 👏',
      error: (error: Error) => error.message
    })
  })

  return (
    <>
      <Button variant="outline" onClick={event => handleClick2(event, 'github')}>
        <Github data-icon="inline-start" /> 使用 GitHub 登录
      </Button>
      <Button variant="outline" onClick={event => handleClick2(event, 'google')}>
        <Google data-icon="inline-start" /> 使用 Google 登录
      </Button>
    </>
  )
}
