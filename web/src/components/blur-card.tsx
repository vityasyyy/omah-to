import { cn } from '@/lib/utils'

const BlurCard = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <main
      className={cn(
        'relative flex flex-col gap-2 overflow-hidden rounded-xl border-t-[2px] bg-white/20 p-6 shadow-lg backdrop-blur-xl *:text-start md:justify-between md:*:text-center',
        className
      )}
      style={{ boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5)' }}
    >
      {children}
    </main>
  )
}

export default BlurCard
