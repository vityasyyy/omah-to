import { cn } from '@/lib/utils'

type SmallStyledCardProps = {
  children?: React.ReactNode
  className?: string
}

const SmallStyledCard = (props: SmallStyledCardProps) => {
  return (
    <main
      className={cn(
        'flex w-fit shrink-0 flex-row items-center justify-center gap-2 overflow-hidden rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-bold md:text-base',
        props.className
      )}
    >
      {/* content goes here */}
      {props.children}
    </main>
  )
}

export default SmallStyledCard
