'use client'

import { NeonAuthUIProvider } from '@neondatabase/auth/react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'

import { useTheme } from '@/hooks/use-theme'
import { authClient } from '@/lib/auth/client'
import { isDev } from '@/lib/utils'

export function AuthProvider({ children }: React.PropsWithChildren) {
  const router = useRouter()
  const { isDark } = useTheme()

  return (
    <NeonAuthUIProvider
      emailOTP
      Link={Link}
      authClient={authClient}
      credentials={{ forgotPassword: true }}
      defaultTheme={isDark ? 'dark' : 'light'}
      navigate={router.push}
      redirectTo="/"
      replace={router.replace}
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
