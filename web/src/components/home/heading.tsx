import { cn } from '@/lib/utils'
import React from 'react'

type HeadingProps = {
  className?: string
  children?: React.ReactNode
}

const Heading = (props: HeadingProps) => {
  return (
    <h1
      className={cn(
        'text-2xl/relaxed font-normal text-pretty lg:text-3xl/relaxed',
        props.className
      )}
    >
      {props.children}
    </h1>
  )
}

type HeadingSpanProps = {
  className?: string
  children?: React.ReactNode
}

export const HeadingSpan = (props: HeadingSpanProps) => (
  <span className={cn('text-primary-700 font-bold', props.className)}>
    {props.children}
  </span>
)

export default Heading
