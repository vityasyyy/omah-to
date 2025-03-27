'use client'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Alumni } from '@/lib/helpers/alumni'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const AlumniCarousel = ({ alumni }: { alumni: Alumni[] }) => {
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
    <Carousel setApi={setApi} className='w-full bg-transparent'>
      <CarouselContent className='relative z-10 -ml-2 bg-transparent px-4 pb-10 md:px-10 md:-ml-[3vw]'>
        {alumni.map((alumni, index) => (
          <CarouselItem
            key={index}
            className={`
              basis-[95%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4 pl-2 md:pl-[3vw] 
              transition-all ease-in-out 
              ${current !== index + 1 ? 'scale-90 sm:scale-95 md:scale-100' : 'scale-100'}
            `}
          >
            <Card {...alumni} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='left-0 z-10 2xl:-left-10' />
      <CarouselNext className='right-0 z-10 2xl:-right-10' />
    </Carousel>
  )
}

const Card = ({
  name,
  slug,
  title,
  education,
  description,
}: Alumni) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <main className='border-primary-100 relative grid h-[400px] grid-rows-[1fr,auto] overflow-hidden rounded-2xl border-2 bg-white shadow-lg'>
      <section
        className={`border-primary-100 relative flex w-full flex-col justify-end gap-0.5 overflow-hidden rounded-b-2xl border-b-2 bg-neutral-200 p-4 transition-all duration-300 ease-in-out ${
          isExpanded ? 'min-h-[200px]' : 'min-h-[350px]'
        }`}
      >
        <h1 className='bg-primary-100 z-10 w-fit px-1 py-0.5 text-lg font-bold'>
          {name}
        </h1>
        <h2 className='bg-primary-100 z-10 w-fit px-1 py-0.5 text-base font-bold'>
          {title}
        </h2>
        <h3 className='bg-primary-100 z-10 w-fit px-1 py-0.5 text-base font-normal'>
          {education}
        </h3>

        {/* image + overlay */}
        <Image
          src={`/assets/alumni/${slug}.webp`}
          alt={name}
          className='z-0 object-cover select-none'
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
          className={`line-clamp-6 select-none hover:cursor-default overflow-hidden text-justify text-sm transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[150px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {description}
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
              : 'Click untuk baca'}
          </span>
        </button>
      </section>
    </main>
  )
}

export default AlumniCarousel
