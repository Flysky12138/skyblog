'use client'

import { BuiltInProviderType } from 'next-auth/providers'
import { signIn } from 'next-auth/react'
import { useAsyncFn } from 'react-use'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OAuthSignInButtonProps extends React.ComponentProps<typeof Button> {
  provider: BuiltInProviderType
}

export const OAuthSignInButton = ({ className, provider, ...props }: OAuthSignInButtonProps) => {
  const [{ loading }, handleSignIn] = useAsyncFn(signIn)

  return (
    <Button
      className={cn('grid grid-cols-[auto_1fr] gap-4 font-bold', className)}
      disabled={loading}
      size="lg"
      variant="outline"
      onClick={() => {
        handleSignIn(provider)
      }}
      {...props}
    />
  )
}
