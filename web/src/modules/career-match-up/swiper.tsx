'use client'

import { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { alumniCards } from '@/lib/career-match-up'
import { useSlidesToShow } from '@/hooks/useSlidesToShow'
import AlumniCardItem, { Card } from './alumni-card-item'
const SwiperWireframe = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const slidesToShow = useSlidesToShow()

  return (
    <div className='relative mx-auto w-full max-w-7xl px-4'>
      <Carousel opts={{ align: 'start' }} className='w-full'>
        <div className='relative'>
          <CarouselPrevious
            aria-label='Slide sebelumnya'
            className='absolute top-26 left-0 z-10 -translate-y-1/2 bg-white/20 transition-colors hover:bg-white/30'
          />
          <CarouselNext
            aria-label='Slide selanjutnya'
            className='absolute top-26 right-0 z-10 -translate-y-1/2 bg-white/20 transition-colors hover:bg-white/30'
          />
        </div>

        <CarouselContent className='-ml-1'>
          {alumniCards.map((alumniCard: Card, index: number) => (
            <CarouselItem
              key={index}
              className={`pl-1 ${
                slidesToShow === 4
                  ? 'sm:basis-full md:basis-1/2 lg:basis-1/4'
                  : slidesToShow === 2
                    ? 'sm:basis-full md:basis-1/2'
                    : 'basis-full'
              }`}
            >
              <AlumniCardItem
                card={alumniCard}
                isExpanded={expandedIndex === index}
                onToggle={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default SwiperWireframe
