'use client'

import { Button } from '@repo/ui/components/button'
import React from 'react'

import Github from '@/assets/svg/github.svg'
import Google from '@/assets/svg/google.svg'
import { authClient } from '@/lib/auth/client'
import { toastPromise } from '@/lib/toast'

type Provider = Parameters<typeof authClient.signIn.social>[0]['provider']

export function AuthSocialButton() {
  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>, provider: Provider) => {
    const fieldset = event.currentTarget.closest('fieldset')

    try {
      if (fieldset) {
        fieldset.inert = true
      }
      const { error } = await authClient.signIn.social({ callbackURL: process.env.NEXT_PUBLIC_WEBSITE_URL, provider })
      if (error) {
        throw new Error(error.message)
      }
    } finally {
      if (fieldset) {
        fieldset.inert = false
      }
    }
  }

  const handleClick = async (...params: Parameters<typeof handleLogin>) => {
    try {
      await toastPromise(handleLogin(...params), {
        loading: '登录中...',
        success: '登录成功 👏',
        error: (error: Error) => error.message
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={event => {
          void handleClick(event, 'github')
        }}
      >
        <Github /> 使用 GitHub 登录
      </Button>
      <Button
        variant="outline"
        onClick={event => {
          void handleClick(event, 'google')
        }}
      >
        <Google /> 使用 Google 登录
      </Button>
    </>
  )
}
