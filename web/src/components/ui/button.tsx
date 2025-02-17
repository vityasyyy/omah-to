import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-neutral-950/10 dark:ring-neutral-950/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 dark:ring-neutral-300/10 dark:dark:ring-neutral-300/20",
  {
    variants: {
      variant: {
        default:
          "bg-primary-new-500 text-neutral-50 shadow-sm hover:bg-primary-new-500/90",
        destructive:
          "bg-white text-error-600 shadow-xs hover:bg-error-400 border-2",
        destructiveGhost:
        'text-error-600 hover:bg-error-400 hover:text-white',
        outline:
          'border-2 text-primary-new-500 border-primary-new-500 bg-transparent shadow-xs hover:bg-primary-new-500/10 hover:text-primary-new-500/90',
        secondary:
          'bg-primary-500 text-white shadow-xs hover:bg-primary-500/80 ark:text-neutral-50 800/80',
        secondaryOutline:
          'border-2 text-primary-500 border-primary-500 bg-transparent shadow-xs hover:bg-primary-new-500/10 hover:text-primary-new/90 ',
        ghost: 'hover:bg-neutral-100 hover:text-neutral-900',
        link: 'text-primary underline-offset-8 hover:underline',
        card: 'bg-white text-black border-neutral-200 border hover:bg-neutral-100',
        white: 'bg-white text-black hover:bg-neutral-100'
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
