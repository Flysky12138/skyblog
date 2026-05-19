import { createNeonAuth } from '@neondatabase/auth/next/server'

import { isDev } from '../utils'

export const authServer = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL,
  cookies: {
    domain: isDev() ? undefined : process.env.NEXT_PUBLIC_WEBSITE_URL.replace(/https?:\/\//, ''),
    secret: process.env.NEON_AUTH_COOKIE_SECRET,
    sessionDataTtl: 300
  }
})
