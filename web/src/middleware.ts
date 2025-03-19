/* eslint-disable @typescript-eslint/no-explicit-any */

// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function setHeaders(response: NextResponse, userData: any) {
  response.headers.set('x-user-id', userData.user_id)
  response.headers.set('x-user-asal_sekolah', userData.asal_sekolah)
  response.headers.set('x-user-username', userData.username)
  response.headers.set('x-user-email', userData.email)
}

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname

  // Define path patterns
  const authRequiredPaths = [
    '/dashboard',
    '/profile',
    '/settings',
    '/tryout$',
    '/tryout/pembahasan',
  ]

  const publicPaths = ['/', '/login', '/register', '/forgot-password']

  // Check if path requires authentication
  const requiresAuth = authRequiredPaths.some((path) =>
    path.endsWith('$')
      ? currentPath === path.slice(0, -1)
      : currentPath.startsWith(path)
  )

  // Check if path is explicitly public
  const isPublicPath = publicPaths.some((path) => currentPath.startsWith(path))

  // Special case for tryout paths (all are public except /tryout and /tryout/pembahasan)
  const isTryoutPath = currentPath.startsWith('/tryout/')
  const isPublicTryoutPath =
    isTryoutPath && !currentPath.startsWith('/tryout/pembahasan')

  // Create default response
  const response = NextResponse.next()

  // Skip token validation for public paths if not needed
  if ((isPublicPath || isPublicTryoutPath) && !requiresAuth) {
    return response
  }

  // Check for tokens
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  // If no tokens exist and authentication is required, redirect to login
  if (!accessToken && !refreshToken && requiresAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Process authentication - try access token first
  if (accessToken) {
    try {
      const res = await fetch(`${process.env.AUTH_URL}/auth/validateprofile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `access_token=${accessToken}`,
        },
        credentials: 'include',
      })

      if (res.ok) {
        const userData = await res.json()
        setHeaders(response, userData)
        return response
      }
    } catch (error) {
      console.error('Access token validation error:', error)
    }
  }

  // Try refresh token if access token failed
  if (refreshToken) {
    try {
      const res = await fetch(`${process.env.AUTH_URL}/user/refresh`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `refresh_token=${refreshToken}`,
        },
        credentials: 'include',
      })

      if (res.ok) {
        const resBody = await res.json()
        const setCookieHeader = res.headers.get('set-cookie')
        if (!setCookieHeader) {
          if (!requiresAuth) return response
          return NextResponse.redirect(new URL('/login', request.url))
        }

        response.headers.set('Set-Cookie', setCookieHeader)
        setHeaders(response, resBody)
        return response
      }
    } catch (error) {
      console.error('Refresh token error:', error)
    }
  }

  // If authentication failed but path doesn't require auth, allow access
  if (!requiresAuth) {
    return response
  }

  // Otherwise redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}

// Configure middleware to run only on routes that might need authentication or user data
export const config = {
  matcher: [
    // Specific auth required paths
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/tryout',
    '/tryout/pembahasan/:path*',

    // Public paths that might need user data
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/tryout/:path*',
  ],
}
