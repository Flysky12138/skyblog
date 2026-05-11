'use client'

import { createAuthClient } from '@neondatabase/auth/next'

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient()
