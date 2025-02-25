import Container from '@/components/container'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import Link from 'next/link'
import { StringDecoder } from 'string_decoder'

const Inspiration = () => {
  return (
    <Container className='mt-12 mb-4'>
      <h1 className='mb-12 self-center text-center text-2xl font-bold md:max-w-lg lg:text-3xl'>
        Inspirasi dari Ahli{' '}
        <span className='text-primary-500'> Computer Science </span>
      </h1>

      <Carousel className='w-full bg-transparent'>
        <CarouselContent className='relative z-10 -ml-[3vw] bg-transparent px-10'>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className='pl-[3vw] sm:basis-1/2 md:basis-1/3 lg:basis-1/4'
            >
              <Card
                title='Fahmi Shampoerna'
                subtitle='Full Stack Engineer'
                description='CS23 | Universitas Gadjah Mada'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-0 z-10 2xl:-left-10' />
        <CarouselNext className='right-0 z-10 2xl:-right-10' />
      </Carousel>
    </Container>
  )
}

const Card = ({
  title,
  subtitle,
  description,
}: {
  title: string
  subtitle: string
  description: string
}) => {
  return (
    <main className='bg-secondary-new-500 relative rounded-2xl'>
      <section className='relative flex aspect-[5/6] w-full flex-col justify-end gap-0.5 overflow-clip rounded-2xl bg-neutral-200 p-4'>
        <h1 className='bg-primary-new-500 z-10 w-fit p-0.5 text-lg font-bold text-white'>
          {title}
        </h1>
        <h2 className='bg-primary-new-500 z-10 w-fit p-0.5 text-base font-bold text-white'>
          {subtitle}
        </h2>
        <h3 className='bg-primary-new-500 z-10 w-fit p-0.5 text-base font-normal text-white'>
          {description}
        </h3>

        {/* image + overlay */}
        <Image
          src={`/hero.jpg`}
          alt='Description'
          className='z-0 object-cover'
          sizes='50%'
          fill
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
      </section>
      <Link
        href={`https://linkedin.com/sultandevin`}
        className='block px-4 py-2 text-sm font-semibold text-white'
      >
        Click untuk baca lebih lanjut
      </Link>
    </main>
  )
}

export default Inspiration
