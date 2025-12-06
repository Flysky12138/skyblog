import { createNeonAuth } from '@neondatabase/auth/next/server'

export const auth = createNeonAuth({
  baseUrl: process.env.NEXT_PUBLIC_WEBSITE_URL,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET
  }
})
