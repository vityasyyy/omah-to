import StyledCard from '@/components/tryout/styled-card'
import Image from 'next/image'
import { validateUserAuth } from '@/lib/auth/helper'
import { redirect } from 'next/navigation'
import AuthSync from '@/components/auth/auth-sync'

const DUMMY_PROFILE = {
  name: 'Fahmi Shampoerna',
  school: 'SMAN 3 Yogyakarta',
}

const ProfileCard = async () => {
  const { userData, valid, newTokens } = await validateUserAuth()
  console.log(userData);
  console.log(newTokens);
  if (!valid) {
    redirect('/login')
  }
  return (<>
  <AuthSync newTokens={newTokens}/>
    <StyledCard title='Profile' className=''>
      <main className='flex h-full items-center gap-4 md:flex-col md:justify-center md:text-center'>
        <section className='relative aspect-square w-10 overflow-hidden rounded-sm bg-neutral-400 md:mx-auto md:aspect-10/11 md:w-full md:rounded-2xl'>
          <Image
            src={`/azhari.jpg`}
            alt='Azhari'
            fill
            sizes='40%'
            className='object-cover'
          />
        </section>

        <section className='flex flex-col gap-1'>
          <h1 className='text-[19px] text-black'>{userData?.username}</h1>
          <h2 className='text-sm'>{userData?.asal_sekolah}</h2>
        </section>
      </main>
    </StyledCard>
  </>)
}

export default ProfileCard
