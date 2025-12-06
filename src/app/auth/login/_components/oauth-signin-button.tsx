import { ProviderId } from 'next-auth/providers'
import React from 'react'

import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth'
import { cn } from '@/lib/utils'

import { ButtonClickOnce } from '../../_components/button-click-once'

interface OAuthSignInButtonProps extends React.ComponentProps<typeof Button> {
  provider: ProviderId
}

export const OAuthSignInButton = ({ className, provider, ...props }: OAuthSignInButtonProps) => {
  return (
    <form
      action={async formData => {
        'use server'
        await signIn(provider, formData)
      }}
    >
      <ButtonClickOnce className={cn('font-bold', className)} size="lg" type="submit" variant="outline" {...props} />
    </form>
  )
}
