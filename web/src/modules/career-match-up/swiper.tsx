'use client'

import { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/tryout-carousel'
import { alumniCards } from '@/lib/career-match-up'
import { useSlidesToShow } from '@/hooks/useSlidesToShow'
import AlumniCardItem, { Card } from './alumni-card-item'
import Container from '@/components/container'

const Swiper = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const slidesToShow = useSlidesToShow()

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4">
      <Carousel 
        opts={{
          align: 'start',
          slidesToScroll: 1
        }}
        className="w-full"
      >
        <Container className="relative">
          <CarouselPrevious
            aria-label="Slide sebelumnya"
            className="absolute top-48 left-0 z-10 -translate-y-1/2 border border-primary-800 rounded-full bg-white/20 transition-colors hover:bg-white/30"
          />
          <CarouselNext
            aria-label="Slide selanjutnya"
            className="absolute top-48 right-0 z-10 -translate-y-1/2 border border-primary-800 rounded-full bg-white/20 transition-colors hover:bg-white/30"
          />
        </Container>

        <div className="w-full px-12">
          <CarouselContent className="-ml-0 flex">
            {alumniCards.map((alumniCard: Card, index: number) => (
              <CarouselItem
                key={index}
                className={`pl-0 ${
                  slidesToShow === 4
                    ? 'basis-1/4'
                    : slidesToShow === 3
                    ? 'basis-1/3'
                    : slidesToShow === 2
                    ? 'basis-1/2'
                    : 'basis-full'
                }`}
              >
                <div className="px-2">
                  <AlumniCardItem
                    card={alumniCard}
                    isExpanded={expandedIndex === index}
                    onToggle={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </div>
  )
}

export default Swiper