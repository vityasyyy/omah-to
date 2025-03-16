import Container from '@/components/container'
import RemainingTime from '@/components/tryout/remaining-time'
import TopBar from '@/components/tryout/top-bar'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const subtestDetails: Record<string, { title: string; index: number; description: string }> = {
  subtest_pu: {
    title: 'Pengetahuan Umum',
    index: 1,
    description: 'Uji wawasan umummu dengan berbagai pertanyaan tentang dunia, sejarah, dan ilmu pengetahuan.',
  },
  subtest_ppu: {
    title: 'Pengetahuan dan Pemahaman Umum',
    index: 2,
    description: 'Tes kemampuan memahami informasi dan wawasan umum dalam berbagai konteks.',
  },
  subtest_pbm: {
    title: 'Pengetahuan Membaca dan Menulis',
    index: 3,
    description: 'Uji keterampilan membaca dan menulis untuk memahami dan menyampaikan informasi secara efektif.',
  },
  subtest_pk: {
    title: 'Pengetahuan Kuantitatif',
    index: 4,
    description: 'Tes pemahaman konsep matematika dasar dan kemampuan analisis kuantitatif.',
  },
  subtest_lbi: {
    title: 'Literasi Bahasa Indonesia',
    index: 5,
    description: 'Uji pemahaman dan keterampilan berbahasa Indonesia dalam berbagai situasi komunikasi.',
  },
  subtest_lbe: {
    title: 'Literasi Bahasa Inggris',
    index: 6,
    description: 'Tes kemampuan membaca dan memahami teks berbahasa Inggris dalam berbagai konteks.',
  },
  subtest_pm: {
    title: 'Penalaran Matematika',
    index: 7,
    description: 'Uji kemampuan berpikir logis dan pemecahan masalah melalui soal-soal matematika.',
  },
};


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
    redirect('/tryout')
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
          <RemainingTime time={""} className='md:px-6 md:py-3' />
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
