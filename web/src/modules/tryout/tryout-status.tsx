import RemainingTime from '@/components/tryout/remaining-time'
import SmallStyledCard from '@/components/tryout/small-styled-card'
import { SUBTESTS } from '@/lib/helpers/subtests'
import { User } from '@/lib/types/types'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const TryoutStatus = ({
  title,
  time,
  user,
}: {
  title: string
  time: Date
  user?: User
}) => {
  const displayTitle = SUBTESTS[title].title

  return (
    <>
      <main className='flex gap-2 md:gap-6'>
        <RemainingTime
          time={time}
          className='w-full shrink md:w-fit md:shrink-0'
        />
        <TitleCard title={displayTitle} className='hidden md:flex' />
        <ProfileCard
          user={user}
          className='w-full shrink md:w-fit md:shrink-0'
        />
      </main>
      <TitleCard title={displayTitle} className='md:hidden' />
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
      className={cn(
        'text-primary-900 w-full shrink text-center text-base',
        className
      )}
    >
      {title}
    </SmallStyledCard>
  )
}

const ProfileCard = ({
  className,
  user,
}: {
  className?: string
  user?: User
}) => {
  return (
    <SmallStyledCard className={cn('gap-3 overflow-hidden', className)}>
      <section
        className={cn(
          'relative h-7 w-7 shrink-0 overflow-hidden rounded-sm bg-neutral-200'
        )}
      >
        <Image
          src={`/assets/profile/avatar.webp`}
          alt='Profile Picture'
          fill
          sizes='20%'
          className='object-cover'
        />
      </section>
      <h1 className='overflow-hidden text-ellipsis whitespace-nowrap'>
        {user?.username || 'Nama Siswa'}
      </h1>
    </SmallStyledCard>
  )
}

export default TryoutStatus
