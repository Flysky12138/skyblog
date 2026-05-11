'use client'

import { NeonAuthUIProvider } from '@neondatabase/auth/react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'

import { authClient } from '@/lib/auth/client'
import { isDev } from '@/lib/utils'

export function AuthProvider({ children }: React.PropsWithChildren) {
  const router = useRouter()

  return (
    <NeonAuthUIProvider
      emailOTP
      Link={Link}
      authClient={authClient}
      credentials={{ forgotPassword: true }}
      navigate={router.push.bind(router)}
      redirectTo="/"
      replace={router.replace.bind(router)}
      social={{
        providers: isDev() ? ['google'] : ['github']
      }}
      onSessionChange={() => {
        router.refresh()
      }}
    >
      {children}
    </NeonAuthUIProvider>
  )
}
