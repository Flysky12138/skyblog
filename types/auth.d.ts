import { Role } from '@prisma/client'
import 'next-auth/jwt'
import { GitHubProfile } from 'next-auth/providers/github'

export interface Auth {
  id: string
  role: Role
}

declare module 'next-auth/jwt' {
  interface JWT extends Partial<Auth> {}
}

declare module 'next-auth' {
  interface Session extends Partial<Auth> {}
  interface Account extends Auth {}
  interface Profile extends GitHubProfile {}
}
