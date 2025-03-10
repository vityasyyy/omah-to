import { cn } from '@/lib/utils'

type StyledCardProps = {
  title?: string | React.ReactNode
  subtest?: string
  children?: React.ReactNode
  className?: string
}

const StyledCard = (props: StyledCardProps) => {
  return (
    <main
      className={cn(
        'flex flex-col gap-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white px-4 py-4 shadow-xs',
        props.className
      )}
    >
      <header className='flex h-fit items-center w-full justify-between border-b border-neutral-200 pb-2 text-sm font-bold text-neutral-600 md:text-base'>
        <span>{props.title || 'Title'}</span>
        {props.subtest && (
          <span className='text-neutral-500'>Subtest: {props.subtest}</span>
        )}
      </header>

      {/* content goes here */}
      <div className='mb-2 h-full text-sm font-bold text-neutral-600 md:text-base'>
        {props.children}
      </div>
    </main>
  )
}

export default StyledCard
