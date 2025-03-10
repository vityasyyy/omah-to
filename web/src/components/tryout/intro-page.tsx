import Container from '@/components/container'
import RemainingTime from '@/components/tryout/remaining-time'
import TopBar from '@/components/tryout/top-bar'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'

type IntroPageProps = {
  id: number
  title: string
  description: string
}

const IntroPage = (props: IntroPageProps) => {
  return (
    <main className='relative h-screen'>
      <Container className='z-10 h-full justify-between *:z-10'>
        <section className='flex flex-col gap-4'>
          <TopBar variant='ghost' />
          <RemainingTime className='md:px-6 md:py-3' />
        </section>

        <section className='mt-auto mb-[10vh] flex w-full max-w-(--breakpoint-md) flex-col gap-4 *:font-bold *:text-white'>
          <h3 className='text-sm md:text-base'>Subtest {props.id || '1'}</h3>
          <h1 className='text-4xl font-bold md:text-5xl'>
            {props.title || 'LeBron James'}
          </h1>
          <h2 className='text-sm md:text-base'>
            {props.description ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.'}
          </h2>

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
      <Image
        src={`/hero.jpg`}
        alt='LeBron James'
        fill
        sizes='90%'
        className='z-0 object-cover'
      />
      <div className='bg-primary-new-300/50 absolute inset-0 z-0' />
    </main>
  )
}

export default IntroPage
