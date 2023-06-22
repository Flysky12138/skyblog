'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { BuiltInProviderType } from 'next-auth/providers'
import { signIn } from 'next-auth/react'
import { useAsyncFn } from 'react-use'

interface OAuthSignInButtonProps extends React.ComponentProps<typeof Button> {
  provider: BuiltInProviderType
}

export const OAuthSignInButton = ({ provider, className, ...props }: OAuthSignInButtonProps) => {
  const [{ loading }, handleSignIn] = useAsyncFn(async (provider: BuiltInProviderType) => {
    await signIn(provider)
  })

  return (
    <Button
      className={cn('grid grid-cols-[auto_1fr] gap-5 font-bold', className)}
      disabled={loading}
      variant="outline"
      onClick={() => {
        handleSignIn(provider)
      }}
      {...props}
    />
  )
}
