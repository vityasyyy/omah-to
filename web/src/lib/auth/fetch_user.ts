import { headers } from 'next/headers'
import { cookies } from 'next/headers'

export async function fetchUser() {
  const headersList = await headers()
  const username = headersList.get('x-user-username')
  const email = headersList.get('x-user-email')
  const asalSekolah = headersList.get('x-user-asal_sekolah')
  const id = headersList.get('x-user-id')
  return { username, email, asalSekolah, id }
}

export const fetchUserClient = async (accessToken?: string) => {
  const res = await fetch(`${process.env.AUTH_URL}/auth/validateprofile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${accessToken}`,
    },
    credentials: 'include',
  })
  if (res.ok) {
    setAuthStatus(true)
    return await res.json()
  }

  return null
}

export const setAuthStatus = async (signedIn: boolean) => {
  const cookieStore = await cookies()
  if (signedIn) {
    // Set cookie with isSignedIn=true
    cookieStore.set('isSignedIn', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
  } else {
    cookieStore.delete('isSignedIn')
  }
}
