'use client'
import { cn } from '@/lib/utils'
import SmallStyledCard from './small-styled-card'
import { useEffect, useState } from 'react'

const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const RemainingTime = (props: { time: Date | string; className?: string }) => {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const targetTime = new Date(props.time) // Ensure it's a Date object

    const updateRemainingTime = () => {
      const now = Date.now()
      const diff = Math.max(0, Math.floor((targetTime.getTime() - now) / 1000)) // Convert to seconds
      setRemaining(diff)
    }

    updateRemainingTime()
    const interval = setInterval(updateRemainingTime, 1000)

    return () => clearInterval(interval)
  }, [props.time])

  return (
    <SmallStyledCard
      className={cn('text-error-700 text-nowrap', props.className)}
    >
      Time: {formatTime(remaining)}
    </SmallStyledCard>
  )
}

export default RemainingTime
