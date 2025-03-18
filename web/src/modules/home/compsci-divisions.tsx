'use client'
import Container from '@/components/container'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useRef, useState } from 'react'
import Heading, { HeadingSpan } from '@/components/home/heading'
import { DIVISIONS } from '@/lib/helpers/divisions'

const CompsciDivisions = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  return (
    <main className='my-32 space-y-10 md:space-y-16'>
      <Container>
        <Heading className='self-center text-center'>
          Mau Tahu Beberapa Bidang Kerja Keren di{' '}
          <HeadingSpan> Computer Science</HeadingSpan>?
        </Heading>
      </Container>

      <Carousel
        opts={{}}
        plugins={[plugin.current]}
        setApi={setApi}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className='mx-auto mb-20 w-full max-w-(--breakpoint-2xl)'
      >
        <CarouselContent className='mb-4 sm:-ml-12'>
          <CarouselItem className='basis-[25%] sm:basis-[4%]'></CarouselItem>
          {DIVISIONS.map((item, i) => (
            <CarouselItem
              key={i}
              className={`ease-in-expo basis-1/2 transition-all min-[340px]:basis-1/2 sm:basis-1/3 sm:pl-12 md:basis-1/4 lg:basis-1/5 ${current !== i + 1 && 'scale-70 sm:scale-100'}`}
            >
              <Card index={i} {...item} />
            </CarouselItem>
          ))}
          <CarouselItem className='basis-[25%] sm:basis-[4%]'></CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  )
}

const Card = (props: {
  name: string
  img: string
  description: string
  index: number
}) => {
  return (
    <main
      className='border-primary-100 flex flex-col items-center gap-4 overflow-clip rounded-lg border-4 bg-white p-6 text-center sm:h-full'
    >
      <section className='relative size-30 self-center sm:size-36'>
        <Image
          src={props.img}
          alt='division logo'
          fill
          sizes='50%'
          className='object-cover'
        />
      </section>
      <section className='space-y-2 sm:space-y-0'>
        <h1 className='border-primary-100 w-full border-b-2 pb-3 text-xl font-bold sm:border-b-0 sm:pb-0 sm:text-lg'>
          {props.name}
        </h1>
        <p className='line-clamp-8 max-h-48 overflow-hidden text-justify text-xs text-ellipsis sm:hidden'>
          {props.description}
        </p>
      </section>
    </main>
  )
}

export default CompsciDivisions
