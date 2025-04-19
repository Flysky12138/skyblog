import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { CustomRequest } from './http/request'

/**
 * @see https://authjs.dev/getting-started/migrating-to-v5#configuration-file
 */
export const { handlers, auth } = NextAuth({
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account) {
        token.id = account.id
        token.role = account.role
      }
      return token
    },
    session: async ({ session, ...params }) => {
      const { token } = params
      session.id = token.id
      session.role = token.role
      return session
    },
    signIn: async ({ profile = {}, account }) => {
      const { email, login, avatar_url } = profile
      if (!email || !account) return false

      const { id, role } = await CustomRequest('POST api/auth/user', {
        body: {
          avatarUrl: avatar_url,
          email: email,
          name: login
        }
      })
      account.id = id
      account.role = role

      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout'
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    })
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt'
  }
})
