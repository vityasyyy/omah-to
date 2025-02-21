import Container from '@/components/container'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'

const CompsciDivisions = () => {
  return (
    <>
      <Container className='mt-12 mb-4 gap-12 md:gap-16'>
        <h1 className='text-2xl font-bold md:max-w-lg lg:text-3xl'>
          Mau Tahu Beberapa Bidang Kerja Keren di{' '}
          <span className='text-primary-500'> Computer Science </span>?
        </h1>
      </Container>

      <Carousel  className='w-full max-w-(--breakpoint-2xl) mx-auto'>
        <CarouselContent className='mb-4'>
          <CarouselItem className='basis-[4%]'></CarouselItem>
          {Array.from({ length: 20 }).map((item, i) => (
            <CarouselItem
              key={i}
              className='basis-[75%] min-[340px]:basis-1/2 min-[500px]:basis-1/3 sm:basis-1/4 lg:basis-[15%]'
            >
              <Card />
            </CarouselItem>
          ))}
          <CarouselItem className='basis-[4%]'></CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  )
}

const Card = () => {
  return (
    <main className='flex drop-shadow-lg flex-col items-center justify-between gap-4 rounded-lg bg-[#4759A6] p-6'>
      <section className='relative aspect-square h-36'>
        <Image
          src={`/robot.png`}
          alt='division logo'
          fill
          sizes='50%'
          className='object-cover'
        />
      </section>
      <h1 className='text-center text-lg font-semibold text-white'>
        Front End{' '}
      </h1>
    </main>
  )
}

export default CompsciDivisions
