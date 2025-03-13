// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { set } from 'react-hook-form';

function setHeaders(response: NextResponse, userData: any) {
  response.headers.set('x-user-id', userData.id);
  response.headers.set('x-user-asal_sekolah', userData.asal_sekolah);
  response.headers.set('x-user-username', userData.username);
  response.headers.set('x-user-email', userData.email);
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  
  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/forgot-password'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
  
  // Allow access to public paths without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // If no tokens exist, redirect to login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Check if access token is valid
  if (accessToken) {
    try {
      const res = await fetch(`${process.env.AUTH_URL}/auth/validateprofile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `access_token=${accessToken}`
        },
        credentials: 'include'
      });
      
      if (res.ok) {
        // Token is valid, allow access
        const response = NextResponse.next();
        const userData = await res.json();
        setHeaders(response, userData);
        return response;
      }
    } catch (error) {
      console.error('Access token validation error:', error);
    }
  }
  
  // Access token is invalid, try refresh token if available
  if (refreshToken) {
    try {
      const res = await fetch(`${process.env.AUTH_URL}/user/refresh`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refresh_token=${refreshToken}`
        },
        credentials: 'include'
      });
      
      if (res.ok) {
        const resBody = await res.json();
        // Extract new tokens from response
        const setCookieHeader = res.headers.get('set-cookie');
        if (!setCookieHeader) {
          return NextResponse.redirect(new URL('/login', request.url));
        }
        
        // Create response that will continue to the requested page
        const response = NextResponse.next();
        
        // Forward the Set-Cookie header from the auth service
        response.headers.set('Set-Cookie', setCookieHeader);
        setHeaders(response, resBody);
        return response;
      }
    } catch (error) {
      console.error('Refresh token error:', error);
    }
  }
  
  // If all validation attempts fail, redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Apply to all routes except public assets, api routes, and specific public pages
    '/((?!_next/static|_next/image|favicon.ico|api/refresh-token|api/public|login|register).*)'
  ]
};