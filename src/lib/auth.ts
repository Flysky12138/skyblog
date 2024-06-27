import { Account } from '@auth/core/types'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GitHub from 'next-auth/providers/github'
import { CustomRequest } from './server/request'

// https://next-auth.js.org/configuration/callbacks
export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account) {
        token.id = account.id
        token.role = account.role
      }
      return token
    },
    session: async ({ session, ...params }) => {
      const { token } = params as { token: JWT }
      session.id = token.id
      session.role = token.role
      return session
    },
    signIn: async ({ profile = {}, account }) => {
      const { email, login, avatar_url } = profile
      if (!email || !login || !account) return false

      const { id, role } = await CustomRequest('POST api/auth/user', {
        body: {
          avatarUrl: avatar_url as string,
          email: email,
          name: login as string
        }
      })
      account.id = id
      account.role = role as Account['role']

      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout'
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  }
})
