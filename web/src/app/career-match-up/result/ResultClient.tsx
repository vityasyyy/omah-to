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
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        Return to Test
      </button>
    )
  }

  if (action === 'no-results') {
    return (
      <button 
        onClick={() => router.push('/career-match-up')}
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        Take the Test
      </button>
    )
  }

  return (
    <button 
      onClick={() => router.push('/')}
      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
    >
      Return to Dashboard
    </button>
  )
}
