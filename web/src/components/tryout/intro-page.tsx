import Container from '@/components/container'
import RemainingTime from '@/components/tryout/remaining-time'
import TopBar from '@/components/tryout/top-bar'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { cookies } from 'next/headers'

const subtestDetails: Record<string, { title: string; index: number; description: string }> = {
  subtest_pu: {
    title: 'Pengetahuan Umum',
    index: 1,
    description: 'Uji wawasan umummu dengan berbagai pertanyaan tentang dunia, sejarah, dan ilmu pengetahuan.',
  },
  subtest_mtk: {
    title: 'Matematika',
    index: 2,
    description: 'Tes kemampuan matematika dasar dan pemecahan masalah dengan berbagai soal numerik.',
  },
  subtest_logika: {
    title: 'Logika',
    index: 3,
    description: 'Uji kemampuan berpikir logis dengan serangkaian soal yang mengasah pola pikir kritis.',
  },
}

const IntroPage = async () => {
  const tryoutToken = (await cookies()).get('tryout_token')?.value as string
  const res = await fetch(`${process.env.TRYOUT_URL}/sync/current`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `tryout_token=${tryoutToken}`,
    },
  })

  if (!res.ok) {
    console.error('Failed to fetch current tryout')
    return <div>Error fetching tryout data.</div>
  }

  const currentTryout = await res.json()
  const subtestKey = currentTryout.data.subtest_sekarang || 'subtest_pu' // Default to 'subtest_pu'

  const { title, index, description } = subtestDetails[subtestKey] || {
    title: 'Subtest Tidak Diketahui',
    index: 0,
    description: 'Tidak ada informasi subtest tersedia.',
  }

  return (
    <main className='relative h-screen'>
      <Container className='z-10 h-full justify-between *:z-10'>
        <section className='flex flex-col gap-4'>
          <TopBar variant='ghost' />
          <RemainingTime className='md:px-6 md:py-3' />
        </section>

        <section className='mt-auto mb-[10vh] flex w-full max-w-(--breakpoint-md) flex-col gap-4 *:font-bold *:text-white'>
          <h3 className='text-sm md:text-base'>Subtest {index}</h3>
          <h1 className='text-4xl font-bold md:text-5xl'>{title}</h1>
          <h2 className='text-sm md:text-base'>{description}</h2>

          <Link
            href='/tryout/1'
            className={cn(
              buttonVariants({ variant: 'white' }),
              'mt-2 px-8 w-fit font-medium! text-black!'
            )}
          >
            Mulai Subtest
          </Link>
        </section>
      </Container>

      {/* image + overlay */}
      <Image src={`/hero.jpg`} alt={title} fill sizes='90%' className='z-0 object-cover' />
      <div className='bg-primary-new-300/50 absolute inset-0 z-0' />
    </main>
  )
}

export default IntroPage
