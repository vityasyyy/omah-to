import CareerMatchUpTest from '@/modules/career-match-up/career-test'
import { cookies } from 'next/headers'
import React from 'react'
import { getMbSoal, getMbAttempt } from '@/lib/fetch/mb-fetch'
import { redirect } from 'next/navigation'

async function page() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value;
  const attempt = await getMbAttempt(accessToken, false);
  if (attempt) {
    redirect('/career-match-up/result')
  }
  try {
    const questionsData = await getMbSoal(accessToken);
    return (
      <div className='flex min-h-[calc(100vh-theme(spacing.48))] flex-1 items-center justify-center'>
        <CareerMatchUpTest questions={questionsData} />
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return (
      <div className='flex min-h-[calc(100vh-theme(spacing.48))] flex-1 items-center justify-center flex-col'>
        <h2 className="text-xl font-semibold mb-4">Error</h2>
        <p>Failed to load career questions. Please try again later.</p>
      </div>
    )
  }
}

export default page
