import NextAuth, { User } from 'next-auth'
import GitHub, { GitHubProfile } from 'next-auth/providers/github'

import { CustomRequest } from './http/request'

// 注册，并返回必要数据
const profile = async (params: GitHubProfile): Promise<User> => {
  const { avatar_url, email, login } = params

  if (!email) throw new Error('用户邮箱为空')

  const { avatarUrl, id, name, role } = await CustomRequest('POST /api/auth/user', {
    body: { avatarUrl: avatar_url, email, name: login }
  })

  return { email, id, image: avatarUrl, name, role }
}

/**
 * @see https://authjs.dev/getting-started/migrating-to-v5#configuration-file
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user.role = token.role
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
      profile
    })
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt'
  }
})
