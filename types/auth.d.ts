import { GitHubProfile } from 'next-auth/providers/github'
import 'next-auth/jwt'

import { Role } from '@/prisma/enums'

export interface Auth {
  role?: Role
  userId: string
}

declare module 'next-auth/jwt' {
  interface JWT extends Auth {}
}

declare module 'next-auth' {
  interface Profile extends GitHubProfile {}
  interface User extends Auth {}
}
