import StyledCard from '@/components/tryout/styled-card'
import Image from 'next/image'

const DUMMY_PROFILE = {
  name: 'Fahmi Shampoerna',
  school: 'SMAN 3 Yogyakarta',
}

const ProfileCard = () => {
  return (
    <StyledCard title='Profile' className='text-center'>
      <main className='flex flex-col gap-1 items-center'>
        <section className='relative mx-auto mb-3 aspect-[10/11] w-full overflow-hidden rounded-xl bg-neutral-400 md:rounded-2xl'>
          <Image
            src={`/azhari.jpg`}
            alt='Azhari'
            fill
            sizes='40%'
            className='object-cover'
          />
        </section>

        <h1 className='text-2xl text-black'>{DUMMY_PROFILE.name}</h1>
        <h2>{DUMMY_PROFILE.school}</h2>
      </main>
    </StyledCard>
  )
}

export default ProfileCard
