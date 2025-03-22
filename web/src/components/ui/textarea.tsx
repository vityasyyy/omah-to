import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'focus-visible:ring-primary-500 rw-full flex min-h-64 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-base font-bold text-black shadow-xs placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
