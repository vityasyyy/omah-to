// app/career-match-up/result/page.tsx
'use client'

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Hasil Career Match Up</h1>
      <p className="text-xl">
        Karir yang cocok dengan kamu adalah{' '}
        <strong>{careerTitle}</strong>
      </p>
    </div>
  )
}
