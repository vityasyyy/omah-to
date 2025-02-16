import RemainingTime from '@/components/tryout/remaining-time'
import SmallStyledCard from '@/components/tryout/small-styled-card'
import { cn } from '@/lib/utils'

type TryoutStatusProps = {
  title: string
}

const TryoutStatus = (props: TryoutStatusProps) => {
  return (
    <>
      <main className='flex gap-2 md:gap-6'>
        <RemainingTime className='w-full shrink md:shrink-0 md:w-fit' />
        <TitleCard title={props.title} className='hidden md:flex' />
        <ProfileCard className='w-full shrink md:w-fit md:shrink-0' />
      </main>
      <TitleCard title={props.title} className='md:hidden' />
    </>
  )
}

const TitleCard = ({
  title,
  className,
}: {
  title: string
  className?: string
}) => {
  return (
    <SmallStyledCard
      className={cn('w-full shrink text-base text-primary-900', className)}
    >
      {title}
    </SmallStyledCard>
  )
}

const ProfileCard = ({ className }: { className?: string }) => {
  return (
    <SmallStyledCard className={cn('gap-3 overflow-hidden', className)}>
      <section
        className={cn(
          'relative h-7 w-7 shrink-0 overflow-hidden rounded-sm bg-neutral-200'
        )}
      ></section>
      <h1 className='overflow-hidden text-ellipsis whitespace-nowrap'>
        Fahmi Shampoerna
      </h1>
    </SmallStyledCard>
  )
}

export default TryoutStatus
