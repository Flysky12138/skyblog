import { NeonAuthUIProvider } from '@neondatabase/auth/react'

import { authClient } from '@/lib/auth/client'
import { isDev } from '@/lib/utils'

export function AuthProvider({ children }: React.PropsWithChildren) {
  return (
    <NeonAuthUIProvider
      emailOTP
      authClient={authClient}
      credentials={{ forgotPassword: true }}
      redirectTo="/"
      social={{
        providers: isDev() ? ['google'] : ['github']
      }}
    >
      {children}
    </NeonAuthUIProvider>
  )
}
