import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'aria-invalid:outline-destructive/60 dark:aria-invalid:outline-destructive dark:outline-ring/40 outline-ring/50 flex h-9 w-full min-w-0 rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-base shadow-xs ring-neutral-950/10 transition-[color,box-shadow] selection:bg-neutral-900 selection:text-neutral-50 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500/60 aria-invalid:ring-red-500/20 aria-invalid:focus-visible:ring-[3px] aria-invalid:focus-visible:outline-none md:text-sm dark:border-neutral-800 dark:dark:ring-neutral-300/20 dark:ring-neutral-300/10 dark:ring-neutral-950/20 dark:selection:bg-neutral-50 dark:selection:text-neutral-900 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:aria-invalid:border-red-500 dark:aria-invalid:border-red-900/60 dark:dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-500/40 dark:aria-invalid:ring-red-500/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:dark:aria-invalid:ring-red-900/50 dark:aria-invalid:focus-visible:ring-4',
        className
      )}
      {...props}
    />
  )
}

export { Input }
