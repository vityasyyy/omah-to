import CareerMatchUpTest from '@/modules/career-match-up/career-test'
import { cookies } from 'next/headers'
import React from 'react'
import { getMbAttempt, getMbSoal } from '@/lib/fetch/mb-fetch'
import { redirect } from 'next/navigation'

async function Page() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const attempt = await getMbAttempt(accessToken, false)
  if (attempt) {
    redirect('/career-match-up/result')
  }

  try {
    const questionsData = await getMbSoal(accessToken)
    return (
      <div className='flex min-h-[calc(100vh-theme(spacing.48))] flex-1 items-center justify-center'>
        <CareerMatchUpTest questions={questionsData} />
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch questions:', error)
    return (
      <div className='flex min-h-[calc(100vh-theme(spacing.48))] flex-1 flex-col items-center justify-center'>
        <h2 className='mb-4 text-xl font-semibold'>Error</h2>
        <p>Failed to load career questions. Please try again later.</p>
      </div>
    )
  }
}

export default Page
