'use client'
import Container from '@/components/container'
import Heading, { HeadingSpan } from '@/components/home/heading'
import SoftCircle from '@/components/soft-circle'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { UTBK_STUDENTS, UtbkStudent } from '@/lib/helpers/utbk'
import Image from 'next/image'

const UtbkPerspective = () => {
  return (
    <Container className='relative mt-12 mb-4 gap-12'>
      <Heading className='self-center text-center'>
        UTBK dari Perspektif Mahasiswa{' '}
        <HeadingSpan> Computer Science </HeadingSpan>
      </Heading>

      <section className='relative'>
        <Carousel className='w-full bg-transparent'>
          <CarouselContent className='relative z-10 bg-transparent'>
            {UTBK_STUDENTS.map((student, i) => (
              <CarouselItem
                key={i}
                className={`sm:basis-1/2 lg:basis-1/3 ${i !== 0 && 'pl-12'}`}
              >
                <Card {...student} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* ellipse gradient in the background */}
        <SoftCircle />
      </section>
    </Container>
  )
}

const Card = (props: UtbkStudent) => {
  return (
    <main className='border-primary-100 *:select-none relative h-full w-full rounded-lg border-4 bg-white p-3'>
      <header className='border-primary-100 flex gap-2 border-b-2 pb-3'>
        {/* image */}
        <div className='relative aspect-square h-16 overflow-clip rounded-md'>
          <Image
            src={`/assets/utbk/${props.slug}.webp`}
            alt='CS Student Image'
            fill
            sizes='30%'
            className='object-cover'
          />
        </div>

        {/* header and subheader */}
        <div className='flex flex-col self-end'>
          <h1 className='text-lg font-bold'>{props.name}</h1>
          <h2 className='text-base font-light'>{props.education}</h2>
        </div>
      </header>
      <section className='py-2 text-justify text-sm'>
        Score UTBK: {props.score}
        <br />
        {props.description}
      </section>
    </main>
  )
}

export default UtbkPerspective
