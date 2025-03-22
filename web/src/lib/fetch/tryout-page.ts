import { TRYOUT_URL } from '@/lib/types/url'
import { SubtestsScoreResponse, LeaderboardResponse } from '@/lib/types/types'

export const getSubtestsScore = async (
  accessToken: string
): Promise<SubtestsScoreResponse> => {
  const res = await fetch(`${TRYOUT_URL}/tryout/subtests-score`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${accessToken}`,
    },
    credentials: 'include',
    next: { revalidate: 3600 },
  })
  if (res.ok) {
    const responseJSON = await res.json()
    return responseJSON
  }
  return null
}

export const getLeaderboard = async (
  accessToken: string
): Promise<LeaderboardResponse> => {
  const res = await fetch(`${TRYOUT_URL}/tryout/leaderboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${accessToken}`,
    },
    credentials: 'include',
    next: { revalidate: 3600 },
  })
  if (res.ok) {
    const responseJSON = await res.json()
    return responseJSON
  }
  return null
}

export const getOngoingAttempt = async (accessToken: string) => {
  const res = await fetch(`${TRYOUT_URL}/tryout/ongoing-attempts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${accessToken}`,
    },
    credentials: 'include',
  })
  if (res.ok) {
    const responseJSON = await res.json()
    const { data } = responseJSON
    if (data != null) {
      return true
    }
  }
  return false
}

export const getFinishedAttempt = async (accessToken: string) => {
  const res = await fetch(`${TRYOUT_URL}/tryout/finished-attempt`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${accessToken}`,
    },
    credentials: 'include',
  })
  if (res.ok) {
    const responseJSON = await res.json()
    const { data } = responseJSON
    if (data != null) {
      return true
    }
    return false
  }
  return false
}

export const getPembahasanPaket1 = async (accessToken: string) => {
  const res = await fetch(`${TRYOUT_URL}/tryout/pembahasan?paket=paket1`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${accessToken}`,
    },
    credentials: 'include',
    cache: 'force-cache'
  })
  if (res.ok) {
    const responseJSON = await res.json()
    return responseJSON
  }
  return null
}
