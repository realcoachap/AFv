import NextAuth from 'next-auth'
import authConfig from './auth.config'

// Get trusted hosts from environment or use defaults
const getTrustedHosts = (): boolean => {
  // Always trust hosts in production (Railway handles this)
  // In development, also trust localhost
  return true
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: getTrustedHosts(),
})
