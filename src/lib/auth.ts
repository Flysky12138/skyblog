import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

import { Role } from '@/prisma/enums'

import { CustomRequest } from './http/request'

/**
 * @see https://authjs.dev/getting-started/migrating-to-v5#configuration-file
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role
        token.userId = user.userId!
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user.role = token.role
      session.user.userId = token.userId
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout'
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile: async ({ avatar_url, email, login }) => {
        if (!email) {
          throw new Error('用户邮箱为空')
        }

        const { avatarUrl, id, name, role } = await CustomRequest('POST /api/auth/user', {
          body: { avatarUrl: avatar_url, email, name: login }
        })

        return {
          email,
          image: avatarUrl,
          name,
          role,
          userId: id
        }
      }
    })
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt'
  }
})

/**
 * 验证登录；服务端方法，客户端使用 `useSession()`
 */
export const verifyLogin = async () => {
  const session = await auth()

  if (session?.user?.role != Role.ADMIN) {
    throw new Error('Unauthorized')
  }
}
