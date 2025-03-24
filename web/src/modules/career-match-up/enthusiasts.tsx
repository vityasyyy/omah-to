'use client'
import Container from '@/components/container'
import Heading from '@/components/home/heading'
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
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Enthusiasts = ({dominantCareer} : {dominantCareer : string}) => {
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
        <span className='text-blue-600 font-semibold'>{dominantCareer}</span> Enthusiasts, dari mahasiswa hingga alumni
      </Heading>
      <Carousel setApi={setApi} className='w-full bg-transparent'>
        <CarouselContent className='relative z-10 -ml-[3vw] bg-transparent px-10 pb-10'>
          <CarouselItem className='basis-[15%] sm:basis-[0%]' />
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className={`basis-[70%] pl-[3vw] transition-all ease-in-out sm:basis-1/2 md:basis-1/3 lg:basis-1/4 ${current !== index + 2 && 'scale-80 sm:scale-100'}`}
            >
              <Card
                title='Fahmi Shampoerna'
                subtitle='Full Stack Engineer'
                description='CS23 | Universitas Gadjah Mada'
              />
            </CarouselItem>
          ))}
          <CarouselItem className='basis-[15%] sm:basis-[0%]' />
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
    <main className='border-primary-100 relative overflow-clip rounded-2xl border-2 bg-white shadow-lg'>
      <section className='border-primary-100 relative flex aspect-[5/6] w-full flex-col justify-end gap-0.5 overflow-clip rounded-b-2xl border-b-2 bg-neutral-200 p-4'>
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
          className='z-0 object-cover'
          sizes='50%'
          fill
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
      </section>
      <Link
        href={`https://linkedin.com/in/sultandevin`}
        className='group hover:text-primary-900 flex items-center gap-2 px-4 py-3 transition-all ease-in'
      >
        <ChevronDown className='size-4 shrink-0 transition-all ease-in group-hover:-rotate-90' />
        <span className='overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap'>
          Click untuk baca lebih lanjut
        </span>
      </Link>
    </main>
  )
}

export default Enthusiasts
