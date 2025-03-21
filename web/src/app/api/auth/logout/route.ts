import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    // clear cookies before communicating to auth service
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')

    if (token) {
      try {
        const response = await fetch(`${process.env.AUTH_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        console.error('A network error occurred. Failed to notify server about logout.')
        // even if ts fails we still continue wit da process 💯💯
      }
    }

    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
