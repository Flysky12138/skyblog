import { authApiHandler } from '@neondatabase/auth/next/server'

globalThis.process.env.NEON_AUTH_BASE_URL = process.env.NEON_AUTH_BASE_URL

export const { GET, POST } = authApiHandler()
