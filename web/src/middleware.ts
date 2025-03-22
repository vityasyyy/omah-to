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
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  // Define public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register', '/forgot-password']

  // Add paths under tryout/* (but not /tryout exactly)
  const currentPath = request.nextUrl.pathname

  // Special case: tryout/pembahasan requires authentication, other tryout/ paths are public
  const isTryoutPembahasan = currentPath.startsWith('/tryout/pembahasan')
  const isTryoutSubpath =
    currentPath.startsWith('/tryout/') &&
    currentPath !== '/tryout/' &&
    !isTryoutPembahasan

  // Check if current path is public
  const isPublicPath =
    publicPaths.some(
      (path) =>
        currentPath === path || (path !== '/' && currentPath.startsWith(path))
    ) || isTryoutSubpath

  // If we have tokens, try to validate and set headers regardless of path
  let userData = null
  let validAuth = false

  // Check if access token is valid
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
        // Token is valid, get user data and set headers
        userData = await res.json()
        validAuth = true

        // If on a public path, still set headers but allow access
        if (isPublicPath) {
          const response = NextResponse.next()
          setHeaders(response, userData)
          return response
        }

        // For protected paths, continue with valid auth
        const response = NextResponse.next()
        setHeaders(response, userData)
        return response
      }
    } catch (error) {
      console.error('Access token validation error:', error)
    }
  }

  // If access token failed, try refresh token
  if (!validAuth && refreshToken) {
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
        userData = resBody
        validAuth = true

        // Extract new tokens from response
        const setCookieHeader = res.headers.get('set-cookie')
        if (!setCookieHeader) {
          if (isPublicPath) return NextResponse.next()
          return NextResponse.redirect(new URL('/login', request.url))
        }

        // Create response that will continue to the requested page
        const response = NextResponse.next()

        // Forward the Set-Cookie header from the auth service
        response.headers.set('Set-Cookie', setCookieHeader)
        setHeaders(response, userData)
        return response
      }
    } catch (error) {
      console.error('Refresh token error:', error)
    }
  }

  // If authentication failed but path is public, allow access without auth
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Otherwise, redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Apply to all routes except public assets, api routes, and specific public pages
    '/((?!_next/static|_next/image|favicon.ico|api/refresh-token|api/public).*)',
  ],
}
