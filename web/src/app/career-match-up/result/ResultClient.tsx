"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ResultClientProps {
  action: 'show-button' | 'error' | 'no-results'
}

export default function ResultClient({ action }: ResultClientProps) {
  const router = useRouter()
  
  useEffect(() => {
    // Clean up any remaining localStorage items
    localStorage.removeItem('careerMatchAnswers')
  }, [])
  
  if (action === 'error') {
    return (
      <button
        onClick={() => router.push('/career-match-up')}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Kembali ke Test
      </button>
    )
  }
  
  if (action === 'no-results') {
    return (
      <button
        onClick={() => router.push('/career-match-up')}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Ikuti Test
      </button>
    )
  }
  
  return (
    <button
      onClick={() => router.push('/')}
      className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
    >
      Kembali ke Dashboard
    </button>
  )
}