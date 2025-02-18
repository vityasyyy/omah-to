"use client"
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
interface Answer {
  id: string
  text: string
}

interface Question {
  id: number
  text: string
  answers: Answer[]
}

const questions: Question[] = [
  {
    id: 1,
    text: 'Ketika menggunakan aplikasi atau website, apa yang paling sering menarik perhatian Anda?',
    answers: [
      { id: 'a1', text: 'Tampilan dan desainnya yang menarik' },
      { id: 'a2', text: 'Cara aplikasi bekerja di belakang layar' },
      { id: 'a3', text: 'Keamanan dan privasi saat menggunakan aplikasi' },
      {
        id: 'a4',
        text: 'Bagaimana aplikasi bisa memberikan rekomendasi yang tepat',
      },
    ],
  },
  {
    id: 2,
    text: 'Kamu suka makan atau minum apa saja?',
    answers: [
      { id: 'a1', text: 'Ayam Goreng + Es teh + Mendoan' },
      { id: 'a2', text: 'Kembung Goreng + Es kopi + Perkedel' },
      { id: 'a3', text: 'Salad Bumbu Kacang + Air putih + Tempe Goreng' },
      { id: 'a4', text: 'Es Krim Mixue + Wedank Ronde' },
    ],
  },
  {
    id: 3,
    text: 'Ketika menggunakan aplikasi atau website, apa yang paling sering menarik perhatian Anda?',
    answers: [
      { id: 'a1', text: 'Tampilan dan desainnya yang menarik' },
      { id: 'a2', text: 'Cara aplikasi bekerja di belakang layar' },
      { id: 'a3', text: 'Keamanan dan privasi saat menggunakan aplikasi' },
      {
        id: 'a4',
        text: 'Bagaimana aplikasi bisa memberikan rekomendasi yang tepat',
      },
    ],
  },
]

interface ProgressBarProps {
  current: number
  total: number
}

const ProgressBar = ({ current, total }: ProgressBarProps) => (
  <div className='mb-2 h-6 w-full rounded-full bg-white/20'>
    <div
      className='h-full rounded-full bg-white transition-all duration-300'
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>
)

interface AnswerCardProps {
  answer: Answer
  selected: boolean
  onSelect: (answerId: string) => void
}

const AnswerCard = ({ answer, selected, onSelect }: AnswerCardProps) => (
    <button
      onClick={() => onSelect(answer.id)}
      className={cn(
        'w-full flex justify-start items-center gap-2 overflow-hidden rounded-xl border-t-[2px] bg-white/20 p-6 shadow-lg backdrop-blur-lg text-start md:justify-between cursor-pointer',
        selected && 'ring-2 ring-white bg-secondary-new-50'
      )}
      style={{ boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5)' }}
    >
      <Image
        src='/azhari.jpg'
        alt=''
        width={96}
        height={96}
        className='h-24 w-24 rounded-lg object-cover'
      />
      <span className='text-white text-start'>{answer.text}</span>
    </button>
)

const CareerQuestion = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const handleAnswer = (answerId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: answerId,
    }))
  }

  const handleNext = () => {
    if(currentQuestion < questions.length - 1){
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if(currentQuestion > 0){
      setCurrentQuestion((prev) => prev - 1)
    }
  }


  const question = questions[currentQuestion]

  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-8'>
      <h1 className='text-center text-2xl font-medium text-white'>
        {question.text}
      </h1>
      <div className='w-full space-y-2'>
        <ProgressBar current={currentQuestion + 1} total={questions.length} />
        <p className='text-center text-sm text-white/80'>
          Pertanyaan {currentQuestion + 1} dari {questions.length}
        </p>
      </div>
      <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
        {question.answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            answer={answer}
            selected={answers[question.id] === answer.id}
            onSelect={handleAnswer}
          />
        ))}
      </div>
      <div className='flex w-full justify-between mt-4'>
        {currentQuestion > 0 && (
          <button
            onClick={handlePrev}
            className='px-4 py-2 bg-white text-blue-500 rounded-lg'
          >
            Prev
          </button>
        )}
        {currentQuestion < questions.length - 1 && (
          <button
            onClick={handleNext}
            className='ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg'
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}

export default CareerQuestion
