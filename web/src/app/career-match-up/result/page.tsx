// app/career-match-up/result/page.tsx
'use client'

import Result from '@/modules/career-match-up/result'
import { useSearchParams } from 'next/navigation'

const careerMapping: Record<string, string> = {
  'UI-UX': 'UI/UX Designer',
  'BE': 'Back End Developer',
  'CYSEC': 'Cyber Security Specialist',
  'DATSCI': 'Data Scientist',
}

export default function ResultPage() {
  const searchParams = useSearchParams()
  const career = searchParams.get('career') || ''
  const careerTitle = careerMapping[career] || 'Tidak diketahui'

  return (
    <main className='bg-neutral-50 min-h-screen'>
      <Result title={careerTitle} />
    </main>
  )
}
