import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        try {
          // Call your Go backend - with credentials: 'include' to accept cookies
          const res = await fetch(`${process.env.AUTH_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          })
          
          if (res.ok) {
            // Return minimal user info - actual data will come from session callback
            return {
              ...res.json(),
              email: credentials?.email
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        // Use credentials: 'include' to send the cookies back to your API
        const res = await fetch(`${process.env.AUTH_URL}/auth/validateprofile`, {
          credentials: 'include'
        })
        
        if (res.ok) {
          session.user = await res.json()
        } else {
          // Handle unauthenticated session
          console.error('Session validation failed')
          // You might want to return null or throw an error depending on your needs
        }
      } catch (error) {
        console.error('Session error:', error)
      }
      
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}