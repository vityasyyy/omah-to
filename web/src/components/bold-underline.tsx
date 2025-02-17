import { cn } from '@/lib/utils'

const BoldUnderline = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <span
      className={cn(
        'text-primary-new-500 font-bold underline underline-offset-2',
        className
      )}
    >
      {children}
    </span>
  )
}

export default BoldUnderline
