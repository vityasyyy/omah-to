// CareerMatchUpTest.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { submitMbAnswers } from '@/lib/fetch/mb-fetch'

// Define Question and Answer interfaces
interface Answer {
  pilihan_id: string
  text_pilihan: string
  divisi: string
}

interface Question {
  kode_soal: string
  text_soal: string
  pilihan: Answer[]
}

interface CareerMatchUpTestProps {
  questions: Question[]
  loading?: boolean
  error?: string
}

interface AnswerState {
  jawaban: string
  divisi: string
}

const CareerMatchUpTest = ({
  questions,
  loading = false,
  error = '',
}: CareerMatchUpTestProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({})
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

  // Load answers from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem('careerMatchAnswers')
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }
  }, [])

  // This useEffect might be causing issues - it only runs if answers have length > 0
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('careerMatchAnswers', JSON.stringify(answers))
    }
  }, [answers])

  const handleAnswer = (answerId: string) => {
    const question = questions[currentQuestion]
    const selectedAnswer = question.pilihan.find(
      (p) => p.pilihan_id === answerId
    )

    if (!selectedAnswer) return

    // Try using a different approach to update state to ensure it's properly tracked
    setAnswers((prevAnswers) => {
      const newAnswers = {
        ...prevAnswers,
        [question.kode_soal]: {
          jawaban: selectedAnswer.divisi, // Store divisi instead of pilihan_id
          divisi: selectedAnswer.divisi,
        },
      }

      // Save immediately to localStorage
      localStorage.setItem('careerMatchAnswers', JSON.stringify(newAnswers))
      return newAnswers
    })

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Show completion dialog when all questions are answered
      setShowDialog(true)
    }
  }

  const handleContinue = async () => {
    try {
      // Format the data for submission
      const submissionData = Object.entries(answers).map(
        ([kode_soal, answer]) => ({
          kode_soal,
          jawaban: answer.jawaban,
        })
      )

      // Submit to the backend
      const result = await submitMbAnswers(submissionData, true)

      if (!result) {
        throw new Error('Failed to submit answers')
      }

      // Clear local storage
      localStorage.removeItem('careerMatchAnswers')

      // Redirect to result page
      router.push('/career-match-up/result')
    } catch (error) {
      console.error('Submission error:', error)
      // Still attempt to redirect
      router.push('/career-match-up/result')
    }
  }

  if (loading)
    return <div className='text-center text-black'>Memuat pertanyaan...</div>
  if (error) return <div className='text-center text-black'>{error}</div>
  if (!questions.length)
    return (
      <div className='text-center text-black'>
        Tidak ada pertanyaan tersedia
      </div>
    )

  const question = questions[currentQuestion]

  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-8 md:max-w-5xl'>
      <h1 className='text-center text-2xl font-medium text-black md:text-3xl'>
        {question.text_soal}
      </h1>
      <ProgressBar current={currentQuestion + 1} total={questions.length} />
      <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-8'>
        {question.pilihan.map((answer) => (
          <AnswerCard
            key={answer.pilihan_id}
            answer={answer}
            selected={answers[question.kode_soal]?.divisi === answer.divisi}
            onSelect={handleAnswer}
          />
        ))}
      </div>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className='bg-secondary-new-500/80'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-white'>SELAMAT!</AlertDialogTitle>
            <AlertDialogDescription className='text-white'>
              Kamu telah menyelesaikan test Career Match Up
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleContinue}>
              Lihat Hasil Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ProgressBar component (same as before)
interface ProgressBarProps {
  current: number
  total: number
}

const ProgressBar = ({ current, total }: ProgressBarProps) => (
  <div className='relative mx-auto mb-4 w-full max-w-3xl'>
    <div className='h-6 w-full rounded-full bg-gray-200'>
      <div
        className='h-6 rounded-full bg-blue-600 transition-all duration-300'
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
    <div className='mt-6 text-center text-sm text-gray-600'>
      Pertanyaan {current} dari {total}
    </div>
  </div>
)

// AnswerCard component (same as before)
interface AnswerCardProps {
  answer: Answer
  selected: boolean
  onSelect: (answerId: string) => void
}

const AnswerCard = ({ answer, selected, onSelect }: AnswerCardProps) => (
  <button
    onClick={() => onSelect(answer.pilihan_id)}
    className={cn(
      'flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 text-start transition-all',
      selected && 'bg-blue-50 ring-2 ring-blue-500'
    )}
  >
    <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-100'>
      {/* Gunakan icon yang sesuai berdasarkan divisi atau custom icon */}
      <Image
        src={`/assets/divisions/${answer.divisi || 'dsai'}.webp`}
        alt=''
        width={48}
        height={48}
        className='object-contain'
      />
    </div>
    <span className='font-medium text-gray-800'>{answer.text_pilihan}</span>
  </button>
)
export default CareerMatchUpTest
