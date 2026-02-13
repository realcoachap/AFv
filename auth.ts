import NextAuth from 'next-auth'
import authConfig from './auth.config'

// Get trusted hosts from environment or use defaults
const getTrustedHosts = (): string[] | boolean => {
  const envHosts = process.env.NEXTAUTH_TRUSTED_HOSTS
  if (envHosts) {
    return envHosts.split(',').map(h => h.trim()).filter(Boolean)
  }
  // In production, require explicit host configuration
  if (process.env.NODE_ENV === 'production') {
    return ['afv-production.up.railway.app'] // Replace with your actual domain
  }
  // In development, allow localhost
  return ['localhost:3000', 'localhost']
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
