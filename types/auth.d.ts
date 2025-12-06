import { Role } from '@prisma/client'
import 'next-auth/jwt'
import { GitHubProfile } from 'next-auth/providers/github'

export interface Auth {
  role?: Role
}

declare module 'next-auth/jwt' {
  interface JWT extends Auth {}
}

declare module 'next-auth' {
  interface Profile extends GitHubProfile {}
  interface User extends Auth {}
}
