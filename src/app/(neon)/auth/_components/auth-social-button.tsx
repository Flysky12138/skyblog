'use client'

import React from 'react'
import { toast } from 'sonner'

import Github from '@/assets/svg/github.svg'
import Google from '@/assets/svg/google.svg'
import { Button } from '@/components/ui-overwrite/button'
import { authClient } from '@/lib/auth/client'

type Provider = Parameters<typeof authClient.signIn.social>[0]['provider']

export function AuthSocialButton() {
  const [disabled, setDisabled] = React.useState(false)

  const handleClick = React.useEffectEvent(async (provider: Provider) => {
    try {
      setDisabled(true)
      const { error } = await authClient.signIn.social({ callbackURL: process.env.NEXT_PUBLIC_WEBSITE_URL, provider })
      if (error) {
        throw new Error(error.message)
      } else {
        toast.success(`登录成功，欢迎 👏`)
      }
    } catch (error) {
      setDisabled(false)
      toast.error((error as Error).message)
    }
  })

  return (
    <>
      <Button loading={disabled} variant="outline" onClick={() => handleClick('github')}>
        <Github /> 使用 GitHub 登录
      </Button>
      <Button loading={disabled} variant="outline" onClick={() => handleClick('google')}>
        <Google /> 使用 Google 登录
      </Button>
    </>
  )
}
