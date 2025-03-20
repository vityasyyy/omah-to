import { cn } from '@/lib/utils'

const Container = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <main
      className={cn(
        `mx-auto flex w-full max-w-(--breakpoint-2xl) flex-col gap-4 px-4 py-4 sm:px-8`,
        className
      )}
    >
      {children}
    </main>
  )
}

export default Container
