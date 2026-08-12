import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authorizeSoa, type SoaSessionUser } from '@/lib/soaAuthorize'
import { isExpired } from '@/lib/utils/soaSignIn'
import {
  AUTHENTICATE_PATH, SESSION_MAX_AGE_SECONDS, SOA_PROVIDER_ID,
} from '@/lib/constants/soa'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Not a password check any more: the credential is the short-lived token
    // SOA hands back on the return leg, and SOA is what verifies it.
    Credentials({
      id: SOA_PROVIDER_ID,
      name: 'SOA',
      credentials: { token: {}, expiresAt: {} },
      authorize: (credentials) => authorizeSoa(credentials?.token, credentials?.expiresAt),
    }),
  ],
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE_SECONDS },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const soa = user as SoaSessionUser
        Object.assign(token, {
          id: soa.id, soaId: soa.soaId, departmentName: soa.departmentName,
          roleNames: soa.roleNames, permissions: soa.permissions, expiresAt: soa.expiresAt,
        })
      }
      // Nothing refreshes the token mid-session: SOA owns every field on it and
      // an edit there reaches the laundry on the next sign-in, which is at most
      // an hour away.
      //
      // Auth.js re-signs the cookie on every read with its own maxAge, so the
      // JWT's `exp` claim always rolls forward and cannot hold SOA's. Keeping
      // the SOA expiry in a field of our own and dropping the token here is
      // what ends the session at the same moment SOA's ends.
      // A cookie with no soaId was minted by the old password sign-in, before
      // SOA owned this. It is not a session any more.
      if (!token.soaId || isExpired(token.expiresAt as number | undefined)) return null
      return token
    },
    session({ session, token }) {
      if (session.user) {
        Object.assign(session.user, {
          id: token.id,
          soaId: token.soaId,
          departmentName: token.departmentName ?? null,
          roleNames: token.roleNames ?? [],
          permissions: token.permissions ?? [],
          expiresAt: token.expiresAt ?? null,
        })
      }
      return session
    },
  },
  pages: { signIn: AUTHENTICATE_PATH },
})
