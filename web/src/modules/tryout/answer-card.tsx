/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import StyledCard from '@/components/tryout/styled-card'
import { ArrowLeft, ArrowRight, Check, Clock } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useCallback, useRef } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { progressTryout, syncTryout } from '@/lib/fetch/tryout-test'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
type Variant = 'multiple_choice' | 'true_false' | 'uraian'

interface AnswerCardProps {
  variant?: Variant
  soal?: any
  soalSemua: any[]
  time: Date
  currentSubtest: string
}

interface AnswerPayload {
  kode_soal: string
  jawaban: string | null
}

interface LocalAnswer extends AnswerPayload {
  updatedAt: number
  synced: boolean
}

const AnswerCard = ({
  time,
  currentSubtest,
  variant = 'multiple_choice',
  soalSemua,
}: AnswerCardProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const basePath = pathname.slice(0, pathname.lastIndexOf('/'))
  const currentNumber =
    Number(pathname.slice(pathname.lastIndexOf('/') + 1)) || 1
  const localStorageKey = `tryout_answers_user`

  // State management
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({})
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>(
    'idle'
  )
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  // Use the time prop directly as timeLimit instead of state
  const timeLimit = time ? time.getTime() : null

  // Derived values
  const totalQuestions = soalSemua.length
  const clampedNumber = Math.min(Math.max(currentNumber, 1), totalQuestions)
  const currentSoal = soalSemua[clampedNumber - 1]
  const isLastQuestion = clampedNumber === totalQuestions

  // Submission handler
  const submitAllAnswers = useCallback(async () => {
    if (hasSubmitted) return

    try {
      setSubmitting(true)
      setSyncStatus('syncing')

      const answersToSubmit = Object.values(answers)
      const result = await progressTryout(answersToSubmit, '', true)

      localStorage.removeItem(localStorageKey)
      setHasSubmitted(true)
      if (timerRef.current) clearInterval(timerRef.current)
      if (currentSubtest === 'subtest_pm') {
        router.push('/tryout')
      } else {
        router.push('/tryout/intro')
      }
      toast.success('Jawaban berhasil disimpan!', {
        position: 'bottom-left'
      })
      return result
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Submission failed. Please try again.', {
        position: 'bottom-left'
      })
    } finally {
      setSubmitting(false)
      setSyncStatus('idle')
    }
  }, [answers, hasSubmitted, localStorageKey, currentSubtest, router])

  // Time limit handler - simplified to just submit when time is up
  useEffect(() => {
    if (!timeLimit) return

    const checkTime = () => {
      if (Date.now() >= timeLimit && !hasSubmitted) {
        // Show notification toast once
        toast.warning('Waktu habis! Jawaban otomatis dikumpulkan.', {
          position: 'bottom-left',
        })
        
        // Submit answers immediately when time is up
        submitAllAnswers();
        
        // Clean up timer
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }

    // Check immediately on mount
    checkTime()

    // Set up the interval for periodic checking
    const intervalId = setInterval(checkTime, 1000)

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timeLimit, hasSubmitted, submitAllAnswers])

  // Sync logic
  const syncWithServer = useCallback(
    async (force = false) => {
      try {
        const savedAnswers = localStorage.getItem(localStorageKey)
        if (!savedAnswers) return

        const answers: LocalAnswer[] = JSON.parse(savedAnswers)
        const answersObj = Object.values(answers)
        const answersToSync = force
          ? answersObj
          : answersObj.filter((a) => !a.synced)
        if (!answersToSync.length && !force) return

        setSyncStatus('syncing')
        const result = await syncTryout(answersToSync, '', true)

        setAnswers((prev) => {
          const merged = { ...prev }
          result.data.answers?.forEach((sa: AnswerPayload) => {
            if (sa?.kode_soal) {
              merged[sa.kode_soal] = {
                ...sa,
                updatedAt: Date.now(),
                synced: true,
              }
            }
          })
          localStorage.setItem(localStorageKey, JSON.stringify(merged))
          return merged
        })

        setLastSynced(new Date())
        setSyncStatus('idle')
      } catch (error) {
        console.error('Sync error:', error)
        setSyncStatus('error')
      }
    },
    [localStorageKey]
  )

  // Initial load
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem(localStorageKey)
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers))

      const interval = setInterval(syncWithServer, 10000)
      return () => clearInterval(interval)
    } catch (error) {
      console.error('Initial load error:', error)
    }
  }, [localStorageKey, syncWithServer])

  // Answer handling
  const updateAnswer = useCallback(
    (kodeSoal: string, jawaban: string | null) => {
      // Allow answer updates as long as not submitted
      if (hasSubmitted) return

      setAnswers((prev) => {
        const updated = {
          ...prev,
          [kodeSoal]: {
            kode_soal: kodeSoal,
            jawaban,
            updatedAt: Date.now(),
            synced: false,
          },
        }
        localStorage.setItem(localStorageKey, JSON.stringify(updated))

        // Use setTimeout to dispatch event asynchronously after the current render cycle
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.dispatchEvent(new Event('tryout_answer_updated'))
          }, 0)
        }

        return updated
      })
    },
    [localStorageKey, hasSubmitted]
  )

  // Format time remaining for display
  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Render helpers
  const renderQuestionComponent = () => {
    if (!currentSoal)
      return (
        <div className='p-4 text-center'>Question content not available</div>
      )

    const commonProps = {
      soal: currentSoal,
      savedAnswer: answers[currentSoal.kode_soal]?.jawaban || null,
      onAnswerChange: (value: string) =>
        updateAnswer(currentSoal.kode_soal, value),
      disabled: hasSubmitted, // Disable inputs after submission
    }

    switch (variant) {
      case 'multiple_choice':
        return currentSoal.pilihan_ganda ? (
          <MultipleChoice {...commonProps} />
        ) : null
      case 'true_false':
        return currentSoal.true_false ? <TrueFalse {...commonProps} /> : null
      default:
        return currentSoal.uraian ? <TextAnswer {...commonProps} /> : null
    }
  }

  return (
    <StyledCard title='Jawaban' className='relative gap-1'>
      <main className='flex h-full flex-col'>
        <section className='mb-8 h-96 overflow-y-auto'>
          {renderQuestionComponent()}
        </section>

        <section className='absolute pt-2 inset-x-4 bottom-4 grid grid-cols-2 gap-2 bg-white'>
          <Link
            href={
              clampedNumber > 1 ? `${basePath}/${clampedNumber - 1}` : pathname
            }
            className={cn(
              buttonVariants({ variant: 'secondaryOutline' }),
              'border-[1.5px]',
              (clampedNumber === 1 || hasSubmitted) &&
                'pointer-events-none opacity-50'
            )}
            replace
          >
            <ArrowLeft />
            Back
          </Link>

          {isLastQuestion ? (
            <button
              disabled={true}
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                'flex cursor-not-allowed items-center justify-center gap-2'
              )}
            >
              Wait for Time to End
              <Clock size={16} />
            </button>
          ) : (
            <Link
              href={`${basePath}/${clampedNumber + 1}`}
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                hasSubmitted && 'pointer-events-none opacity-50'
              )}
              replace
            >
              Next
              <ArrowRight />
            </Link>
          )}
        </section>
      </main>
    </StyledCard>
  )
}

// Component implementations updated to support disabled state
const MultipleChoice = ({
  soal,
  savedAnswer,
  onAnswerChange,
  disabled = false,
}: {
  soal: any
  savedAnswer: string | null
  onAnswerChange: (value: string) => void
  disabled?: boolean
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    savedAnswer
  )

  useEffect(() => {
    setSelectedAnswer(savedAnswer)
  }, [savedAnswer])

  const handleSelect = (answerId: string) => {
    if (disabled) return
    setSelectedAnswer(answerId)
    onAnswerChange(answerId)
  }

  return (
    <div className='mt-2 mb-4'>
      {soal.pilihan_ganda?.map((option: any, idx: number) => (
        <button
          key={option.soal_pilihan_ganda_id}
          className={`flex w-full items-center justify-between gap-4 rounded-lg px-5 py-5 text-start font-semibold transition-colors ease-in-out ${
            selectedAnswer === option.soal_pilihan_ganda_id
              ? 'bg-primary-500 text-white'
              : 'border-b border-neutral-200 text-black'
          } ${disabled ? 'cursor-not-allowed opacity-80' : ''}`}
          onClick={() => handleSelect(option.soal_pilihan_ganda_id)}
          disabled={disabled}
        >
          <div className='flex items-center gap-4'>
            <h3 className='mr-2 font-bold'>{String.fromCharCode(97 + idx)}.</h3>{' '}
            {/* a, b, c, d */}
            <h2>{option.pilihan}</h2>
          </div>

          <div
            className={`size-4 shrink-0 rounded-full ${selectedAnswer === option.soal_pilihan_ganda_id ? 'bg-success-300' : 'bg-neutral-200'}`}
          />
        </button>
      ))}
    </div>
  )
}

const TextAnswer = ({
  savedAnswer,
  onAnswerChange,
  disabled = false,
}: {
  soal: any
  savedAnswer: string | null
  onAnswerChange: (value: string) => void
  disabled?: boolean
}) => {
  const [text, setText] = useState(savedAnswer || '')

  useEffect(() => {
    setText(savedAnswer || '')
  }, [savedAnswer])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return
    const newValue = e.target.value
    setText(newValue)
    onAnswerChange(newValue)
  }

  return (
    <div className='mb-4'>
      <Textarea
        placeholder='Ketik jawabanmu disini'
        value={text}
        onChange={handleChange}
        disabled={disabled}
        className={disabled ? 'cursor-not-allowed opacity-80' : ''}
      />
    </div>
  )
}

// Fixed TrueFalse component with proper typings and handling
const TrueFalse = ({
  soal,
  savedAnswer,
  onAnswerChange,
  disabled,
}: {
  soal: any
  savedAnswer: string | null
  onAnswerChange: (value: string) => void
  disabled?: boolean
}) => {
  // Track only the IDs of options that are marked as TRUE
  const [trueAnswerIds, setTrueAnswerIds] = useState<string[]>([])
  const prevAnswerRef = useRef<string | null>(null)

  // Initialize from saved answer
  useEffect(() => {
    if (savedAnswer === prevAnswerRef.current) return
    prevAnswerRef.current = savedAnswer

    if (!savedAnswer) {
      setTrueAnswerIds([])
      return
    }

    try {
      // Parse the comma-separated list of IDs
      const ids = savedAnswer.split(',').filter(Boolean)
      setTrueAnswerIds(ids)
    } catch (error) {
      console.error('Error parsing saved true/false answers:', error)
      setTrueAnswerIds([])
    }
  }, [savedAnswer])

  // Sync answers with parent component
  useEffect(() => {
    // Skip initial render when nothing is selected and no previous answer
    if (trueAnswerIds.length === 0 && !prevAnswerRef.current) return

    // Create a comma-separated list of IDs that are marked as true
    const newAnswer = trueAnswerIds.join(',')

    // Only update if different from previous
    if (newAnswer !== prevAnswerRef.current) {
      prevAnswerRef.current = newAnswer
      onAnswerChange(newAnswer)
    }
  }, [trueAnswerIds, onAnswerChange])

  const handleSelect = (optionId: string, isTrue: boolean) => {
    if (disabled) return

    setTrueAnswerIds((prev) => {
      if (isTrue) {
        // Add ID if it's not already included
        return prev.includes(optionId) ? prev : [...prev, optionId]
      } else {
        // Remove ID if it's marked as false
        return prev.filter((id) => id !== optionId)
      }
    })
  }

  return (
    <div className='mb-4 flex flex-col gap-4'>
      {soal.true_false?.map((option: any) => {
        const isTrue = trueAnswerIds.includes(option.soal_true_false_id)

        return (
          <div
            key={option.soal_true_false_id}
            className='flex items-center gap-4'
          >
            <span className='w-40'>{option.pilihan_tf}</span>

            <button
              type='button'
              onClick={() => handleSelect(option.soal_true_false_id, true)}
              className={`rounded border px-4 py-2 ${
                isTrue ? 'bg-primary-500 text-white' : 'bg-white'
              } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
              disabled={disabled}
            >
              True
            </button>

            <button
              type='button'
              onClick={() => handleSelect(option.soal_true_false_id, false)}
              className={`rounded border px-4 py-2 ${
                !isTrue ? 'bg-primary-500 text-white' : 'bg-white'
              } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
              disabled={disabled}
            >
              False
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default AnswerCard
