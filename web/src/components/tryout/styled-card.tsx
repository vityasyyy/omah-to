import { cn } from '@/lib/utils'

type StyledCardProps = {
  title?: string | React.ReactNode
  subtest?: string
  variant?: 'default' | 'blue'
  children?: React.ReactNode
  className?: string
}

const StyledCard = (props: StyledCardProps) => {
  const borderColor =
    props.variant === 'blue' ? 'border-primary-100' : 'border-neutral-200'

  return (
    <main
      className={cn(
        'flex flex-col gap-5 overflow-hidden rounded-2xl border-[1.5px] bg-white px-4 py-4 shadow-xs',
        borderColor,
        props.className
      )}
    >
      <header
        className={cn(
          'flex h-fit w-full items-center justify-between border-b-[1.5px] pb-2 text-sm font-bold text-neutral-600 md:text-base',
          borderColor
        )}
      >
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
