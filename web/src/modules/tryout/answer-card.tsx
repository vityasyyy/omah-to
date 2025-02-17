// VARIANTS: 'choice' | 'text' | 'truefalse'

'use client'

import StyledCard from '@/components/tryout/styled-card'
import { ArrowLeft, ArrowRight, Square, SquareCheckBig } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const DUMMY_ANSWERS = [
  {
    id: 1,
    text: 'Option A',
  },
  {
    id: 2,
    text: 'Option B',
  },
  {
    id: 3,
    text: 'Option C',
  },
  {
    id: 4,
    text: 'Option D',
  },
]

type Variant = 'choice' | 'text' | 'truefalse'

const AnswerCard = ({ variant = 'choice' }: { variant?: Variant }) => {
  const pathname = usePathname()
  const basePath = pathname.slice(0, pathname.lastIndexOf('/'))
  const currentNumber = Number.parseInt(
    pathname.slice(pathname.lastIndexOf('/') + 1)
  )

  return (
    <StyledCard title='Jawaban' className='gap-1'>
      <main className='flex h-full flex-col'>
        {/* multiple choice */}
        {variant === 'choice' ? (
          <MultipleChoice />
        ) : variant === 'truefalse' ? (
          <TrueFalse />
        ) : (
          <TextAnswer />
        )}

        {/* back + next button */}
        <section className='mt-auto grid grid-cols-2 gap-2'>
          <Link
            href={`${basePath}/${currentNumber - 1}`}
            className={buttonVariants({ variant: 'secondaryOutline' })}
          >
            <ArrowLeft />
            Back
          </Link>
          <Link
            href={`${basePath}/${currentNumber + 1}`}
            className={buttonVariants({ variant: 'secondary' })}
          >
            Next
            <ArrowRight />
          </Link>
        </section>
      </main>
    </StyledCard>
  )
}

const MultipleChoice = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  return (
    <>
      {DUMMY_ANSWERS.map((item) => (
        <button
          key={item.id}
          className={`flex w-full items-center justify-between gap-4 rounded-lg px-4 py-4 text-start font-semibold transition-colors ease-in-out ${
            selectedAnswer === item.id
              ? 'bg-blue-500 text-white'
              : 'border-b border-neutral-200 text-black'
          }`}
          onClick={() => setSelectedAnswer(item.id)}
        >
          <div className='flex gap-4'>
            <span className='font-bold'>a.</span>
            {item.text}
          </div>

          {/* round circle thing */}
          <div
            className={`h-4 w-4 rounded-full bg-neutral-200 ${selectedAnswer === item.id ? 'bg-success-300' : 'bg-neutral-200'}`}
          />
        </button>
      ))}
    </>
  )
}

const TextAnswer = () => {
  return <Textarea placeholder='Ketik jawabanmu disini' />
}

const TrueFalse = () => {
  const [answers, setAnswers] = useState<{ [key: number]: boolean }>({})

  const handleAnswer = (id: number, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <>
      {DUMMY_ANSWERS.map((item) => (
        <div
          key={item.id}
          className={`flex w-full items-center justify-between gap-4 rounded-lg border-b border-neutral-200 px-4 py-4 text-start font-semibold text-black transition-colors ease-in-out`}
        >
          <div className='flex gap-4 text-black'>
            <span className='font-bold'>a.</span>
            {item.text}
          </div>
          <div className='flex gap-4'>
            <Button
              onClick={() => handleAnswer(item.id, true)}
              variant={`ghost`}
              size={`icon`}
              className='relative hover:bg-transparent'
            >
              {answers[item.id] === true ? <SquareCheckBig /> : <Square />}
              <h6 className='absolute -top-1.5 text-xs font-light text-neutral-800!'>
                Benar
              </h6>
            </Button>
            <Button
              onClick={() => handleAnswer(item.id, false)}
              variant={`ghost`}
              size={`icon`}
              className='relative hover:bg-transparent'
            >
              {answers[item.id] === false ? <SquareCheckBig /> : <Square />}
              <h6 className='absolute -top-1.5 text-xs font-light text-neutral-800!'>
                Salah
              </h6>
            </Button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnswerCard
