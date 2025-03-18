/* eslint-disable @typescript-eslint/no-explicit-any */

import RemainingTime from '@/components/tryout/remaining-time'
import SmallStyledCard from '@/components/tryout/small-styled-card'
import { cn } from '@/lib/utils'

const subtestTitles: Record<string, string> = {
  subtest_pu: 'Pengetahuan Umum',
  subtest_ppu: 'Pengetahuan dan Pemahaman Umum',
  subtest_pbm: 'Pengetahuan Membaca dan Menulis',
  subtest_pk: 'Pengetahuan Kuantitatif',
  subtest_lbi: 'Literasi Bahasa Indonesia',
  subtest_lbe: 'Literasi Bahasa Inggris',
  subtest_pm: 'Penalaran Matematika',
};

const TryoutStatus = ({ title, time, user }: { title: string, time: Date, user: any }) => {
  const displayTitle = subtestTitles[title] || title;
  return (
    <>
      <main className='flex gap-2 md:gap-6'>
        <RemainingTime time={time} className='w-full shrink md:shrink-0 md:w-fit' />
        <TitleCard title={displayTitle} className='hidden md:flex' />
        <ProfileCard user={user} className='w-full shrink md:w-fit md:shrink-0' />
      </main>
      <TitleCard title={title} className='md:hidden' />
    </>
  );
};


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

const ProfileCard = ({ user, className }: { user: any, className?: string }) => {
  return (
    <SmallStyledCard className={cn('gap-3 overflow-hidden', className)}>
      <section
        className={cn(
          'relative h-7 w-7 shrink-0 overflow-hidden rounded-sm bg-neutral-200'
        )}
      ></section>
      <h1 className='overflow-hidden text-ellipsis whitespace-nowrap'>
        {user.username}
      </h1>
    </SmallStyledCard>
  )
}

export default TryoutStatus
