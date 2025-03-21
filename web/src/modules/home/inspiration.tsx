'use client'
import Container from '@/components/container'
import Heading, { HeadingSpan } from '@/components/home/heading'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Inspiration = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    api.scrollTo(1)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <Container className='my-20 gap-10 md:gap-16'>
      <Heading className='self-center text-center'>
        Inspirasi dari Para Ahli <HeadingSpan> Computer Science </HeadingSpan>
      </Heading>
      <Carousel setApi={setApi} className='w-full bg-transparent'>
        <CarouselContent className='relative z-10 -ml-[3vw] bg-transparent px-10 pb-10'>
          <CarouselItem className='basis-[5%] sm:basis-[0%]' />
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className={`basis-[90%] pl-[3vw] transition-all ease-in-out sm:basis-1/2 md:basis-1/3 lg:basis-1/4 ${current !== index + 2 && 'scale-80 sm:scale-100'}`}
            >
              <Card
                title='Fahmi Shampoerna'
                subtitle='Full Stack Engineer'
                description='CS23 | Universitas Gadjah Mada'
              />
            </CarouselItem>
          ))}
          <CarouselItem className='basis-[5%] sm:basis-[0%]' />
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
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <main className='border-primary-100 relative grid h-[400px] grid-rows-[1fr,auto] overflow-hidden rounded-2xl border-2 bg-white shadow-lg'>
      <section
        className={`border-primary-100 relative flex w-full flex-col justify-end gap-0.5 overflow-hidden rounded-b-2xl border-b-2 bg-neutral-200 p-4 transition-all duration-300 ease-in-out ${
          isExpanded ? 'min-h-[200px]' : 'min-h-[350px]'
        }`}
      >
        <h1 className='bg-primary-100 z-10 w-fit px-1 py-0.5 text-lg font-bold'>
          {title}
        </h1>
        <h2 className='bg-primary-100 z-10 w-fit px-1 py-0.5 text-base font-bold'>
          {subtitle}
        </h2>
        <h3 className='bg-primary-100 z-10 w-fit px-1 py-0.5 text-base font-normal'>
          {description}
        </h3>

        {/* image + overlay */}
        <Image
          src={`/hero.jpg`}
          alt='Description'
          className='z-0 select-none object-cover'
          sizes='50%'
          fill
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
      </section>
      <section
        onClick={() => setIsExpanded(!isExpanded)}
        className='group hover:text-primary-900 flex flex-col items-start px-4 py-3 transition-all duration-300 ease-in-out'
      >
        {/* text */}
        <div
          className={`line-clamp-6 overflow-hidden text-justify text-sm transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[150px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio velit
          fugiat dolore, corporis cumque mollitia libero. Fuga commodi molestias
          blanditiis alias, aut provident eligendi, ullam expedita dolore odio
          quae obcaecati.
        </div>
        {/* button */}
        <button className='mt-auto flex w-full items-center gap-2 select-none'>
          <ChevronDown
            className={`size-4 shrink-0 transition-all duration-300 ease-in-out ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
          <span className='overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap'>
            {isExpanded
              ? 'Click untuk menutup'
              : 'Click untuk baca lebih lanjut'}
          </span>
        </button>
      </section>
    </main>
  )
}

export default Inspiration
