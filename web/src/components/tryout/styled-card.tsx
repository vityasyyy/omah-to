import { cn } from '@/lib/utils'

type StyledCardProps = {
  title?: string
  children?: React.ReactNode
  className?: string
}

const StyledCard = (props: StyledCardProps) => {
  return (
    <main
      className={cn(
        'flex flex-col gap-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white px-6 py-5 shadow-sm',
        props.className
      )}
    >
      <header className='h-fit w-full border-b border-neutral-200 pb-2 font-bold text-neutral-600'>
        {props.title || 'Title'}
      </header>

      {/* content goes here */}
      <div className='mb-2 text-sm font-bold text-neutral-600 md:text-base'>
        {props.children}
      </div>
    </main>
  )
}

export default StyledCard
