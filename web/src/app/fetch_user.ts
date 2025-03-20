/**
 * Functions to handle user authentication and data retrieval
 * @module auth/fetch_user
 */

/**
 * Retrieves the current user's data from request headers
 * @async
 * @returns {Promise<User>} User object if headers exist, null otherwise
 */

/**
 * Validates and fetches user profile data from authentication server
 * @async
 * @param {string} [accessToken] - Optional access token for authentication
 * @returns {Promise<any | null>} User profile data if request succeeds, null otherwise
 * @throws Will throw an error if the fetch request fails
 */
'use server'
import { cookies, headers } from 'next/headers'
import { User } from '../lib/types/types'

export const getAccessToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value as string
}

export const getRefreshToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('refresh_token')?.value as string
}

export async function fetchUser(): Promise<User> {
  const headersList = await headers()
  const username = headersList.get('x-user-username')
  const email = headersList.get('x-user-email')
  const asal_sekolah = headersList.get('x-user-asal_sekolah')
  const user_id = headersList.get('x-user-id')

  if (!username || !email || !asal_sekolah || !user_id) {
    return null
  }

  return { username, email, asal_sekolah, user_id }
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
    return await res.json()
  }

  return null
}
