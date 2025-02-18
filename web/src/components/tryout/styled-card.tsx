import { cn } from '@/lib/utils'

type StyledCardProps = {
  title?: string
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
      <header className='h-fit w-full border-b border-neutral-200 pb-2 text-sm md:text-base font-bold text-neutral-600 flex justify-between'>
      <span>{props.title || 'Title'}</span>
      {props.subtest && <span className="text-neutral-500">Subtest: {props.subtest}</span>}
      </header>

      {/* content goes here */}
      <div className='mb-2 text-sm h-full font-bold text-neutral-600 md:text-base'>
        {props.children}
      </div>
    </main>
  )
}

export default StyledCard
