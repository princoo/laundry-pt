import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getOwnProfile } from '@/services/account.service'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email).toLowerCase() },
        })
        if (!user || !user.isActive) return null
        const valid = await bcrypt.compare(String(credentials.password), user.password)
        if (!valid) return null
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? '',
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = (user as any).role
        token.id = (user as any).id
        token.mustChangePassword = (user as any).mustChangePassword
      }
      // The client calls update() after a password change or profile edit —
      // re-read the record so the token stops lagging behind the database.
      if (trigger === 'update' && token.id) {
        const fresh = await getOwnProfile(token.id as string)
        if (fresh) {
          token.name = fresh.name
          token.email = fresh.email
          token.mustChangePassword = fresh.mustChangePassword
        }
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        ;(session.user as any).id = token.id
        ;(session.user as any).mustChangePassword = token.mustChangePassword
      }
      return session
    },
  },
  pages: { signIn: '/staff/login' },
})
