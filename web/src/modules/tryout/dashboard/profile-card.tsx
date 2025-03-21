import StyledCard from '@/components/tryout/styled-card'
import { User } from '@/lib/types/types'
import Image from 'next/image'

const ProfileCard = async ({ user }: { user: User }) => {
  return (
    <>
      <StyledCard title='Profile' className=''>
        <main className='flex h-full items-center gap-4 md:flex-col md:justify-center md:text-center'>
          <section className='relative aspect-square w-10 overflow-hidden rounded-sm bg-neutral-400 md:mx-auto md:aspect-10/11 md:w-full md:rounded-2xl'>
            <Image
              src={`/assets/profile/avatar.webp`}
              alt='Azhari'
              fill
              sizes='40%'
              className='object-cover'
            />
          </section>

          <section className='flex flex-col gap-1'>
            <h1 className='text-[19px] text-black'>{user?.username}</h1>
            <h2 className='text-sm'>{user?.asal_sekolah}</h2>
          </section>
        </main>
      </StyledCard>
    </>
  )
}

export default ProfileCard
