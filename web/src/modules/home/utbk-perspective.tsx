'use client'
import Container from '@/components/container'
import Heading, { HeadingSpan } from '@/components/home/heading'
import SoftCircle from '@/components/soft-circle'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Image from 'next/image'

const UtbkPerspective = () => {
  // const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  return (
    <Container className='relative mt-12 mb-4 gap-12'>
      <Heading className='self-center text-center'>
        UTBK dari Perspektif Mahasiswa{' '}
        <HeadingSpan> Computer Science </HeadingSpan>
      </Heading>

      {/* <Carousel
        plugins={[plugin.current]}
        className='w-full bg-transparent'
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className='relative z-10 bg-transparent'>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem
              key={index}
              className='bg-red-200 sm:basis-1/2 lg:basis-1/3'
            >
              <Card />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Container> */}
    <section className='relative'>

      <Carousel className='w-full bg-transparent'>
        <CarouselContent className='relative z-10 bg-transparent'>
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem
              key={i}
              className={`sm:basis-1/2 lg:basis-1/3 ${i !== 0 && 'pl-12'}`}
            >
              <Card
                title='Fahmi Shampoerna'
                subtitle='CS23 | Universitas Gadjah Mada'
                description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              />
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

const Card = ({
  title = 'Nama Mahasiswa',
  subtitle = 'CS23 Universitas Gadjah Mada',
  score,
  description = 'Lorem ipsum dolor sit amet, blablabla',
}: {
  title?: string
  subtitle?: string
  score?: number
  description?: string
  src?: string
}) => {
  return (
    <main className='border-primary-100 h-full relative w-full rounded-lg border-4 bg-white p-3'>
      <header className='border-primary-100 flex gap-2 border-b-2 pb-3'>
        {/* image */}
        <div className='relative aspect-square h-16 overflow-clip rounded-md'>
          <Image
            src={`/placeholder.png`}
            alt='CS Student Image'
            fill
            sizes='30%'
            className='object-cover'
          />
        </div>

        {/* header and subheader */}
        <div className='flex flex-col self-end'>
          <h1 className='text-lg font-bold'>{title}</h1>
          <h2 className='text-base font-light'>{subtitle}</h2>
        </div>
      </header>
      <section className='py-2 text-sm'>
        Score UTBK: {score}
        <br />
        {description}
      </section>
    </main>
  )
}

export default UtbkPerspective
