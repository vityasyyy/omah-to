import {
  SOAL_URL,
  TRYOUT_URL,
  PUBLIC_TRYOUT_URL,
  PUBLIC_SOAL_URL,
} from '@/lib/types/url'
import { Jawaban } from '@/lib/types/types'

export const getTryoutUrl = (isPublic?: boolean) => {
  return isPublic ? PUBLIC_TRYOUT_URL : TRYOUT_URL
}

export const getSoalUrl = (isPublic?: boolean) => {
  return isPublic ? PUBLIC_SOAL_URL : SOAL_URL
}

export const getCurrentTryout = async (
  tryoutToken?: string,
  isPublic?: boolean
) => {
  const tryoutUrl = getTryoutUrl(isPublic)
  const res = await fetch(`${tryoutUrl}/sync/current`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `tryout_token=${tryoutToken}`,
    },
  })
  if (!res.ok) {
    return null
  }

  return res.json()
}

export const getSoal = async (
  subtest: string,
  token?: string,
  isPublic?: boolean,
  tokenType?: boolean
) => {
  const soalUrl = getSoalUrl(isPublic)
  const keren = tokenType ? 'tryout_token' : 'access_token'
  const res = await fetch(`${soalUrl}/soal/paket1?subtest=${subtest}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `${keren}=${token}`,
    },
    credentials: 'include',
    cache: 'force-cache',
  })
  if (!res.ok) {
    throw new Error('Failed to fetch soal')
  }

  return res.json()
}

export const syncTryout = async (
  jawaban: Jawaban[],
  tryoutToken?: string,
  isPublic?: boolean
) => {
  const tryoutUrl = getTryoutUrl(isPublic)
  const payload = {
    answers: jawaban,
  }
  const res = await fetch(`${tryoutUrl}/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `tryout_token=${tryoutToken}`,
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw Error(
      'Anda tidak mengumpulkan jawaban tepat waktu, silahkan mulai ulang Tryout.'
    )
  }

  return res.json()
}

export const progressTryout = async (
  jawaban: Jawaban[],
  tryoutToken?: string,
  isPublic?: boolean
) => {
  const tryoutUrl = getTryoutUrl(isPublic)
  const payload = {
    answers: jawaban,
  }
  const res = await fetch(`${tryoutUrl}/sync/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `tryout_token=${tryoutToken}`,
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(
      'Gagal memprogres Tryout, waktu pengumpulan sudah habis.'
    )
  }

  return res.json()
}

export const startTryout = async (accessToken?: string, isPublic?: boolean) => {
  const tryoutUrl = getTryoutUrl(isPublic)

  const res = await fetch(`${tryoutUrl}/tryout/start-attempt/paket1`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${accessToken}`,
    },
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Failed to start tryout')
  }

  return res.json()
}
