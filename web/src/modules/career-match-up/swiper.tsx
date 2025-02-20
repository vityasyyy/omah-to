'use client'

import { useState, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const cards = [
  {
    image: '/azhari.jpg',
    name: 'Name 1',
    desc: 'Short Desc',
    angkatan: '20',
    what: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    image: '/azhari.jpg',
    name: 'Name 2',
    desc: 'Short Desc',
    angkatan: '20',
    what: 'Pendapat saya tentang ini sangat menarik dan inovatif.',
  },
  {
    image: '/azhari.jpg',
    name: 'Name 3',
    desc: 'Short Desc',
    angkatan: '20',
    what: 'Saya pikir ini bisa menjadi solusi untuk banyak masalah.',
  },
  {
    image: '/azhari.jpg',
    name: 'Name 4',
    desc: 'Short Desc',
    angkatan: '20',
    what: 'Sangat menginspirasi! Saya merasa termotivasi setelah melihat ini.',
  },
  {
    image: '/azhari.jpg',
    name: 'Name 5',
    desc: 'Short Desc',
    angkatan: '20',
    what: 'Saya ingin lebih banyak mengetahui tentang ini!',
  },
]

const SwiperWireframe = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [slidesToShow, setSlidesToShow] = useState(4)

  // ✅ FIX: Update jumlah card berdasarkan lebar layar & force rerender
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth >= 1024)
        setSlidesToShow(4) // lg
      else if (window.innerWidth >= 768)
        setSlidesToShow(2) // md
      else setSlidesToShow(1) // sm
    }

    updateSlides()
    window.addEventListener('resize', updateSlides)
    return () => window.removeEventListener('resize', updateSlides)
  }, [])

  return (
    <div className='relative mx-auto w-full max-w-7xl px-4'>
      <Carousel opts={{ align: 'start' }} className='w-full'>
        <div className='relative'>
          <CarouselPrevious className='absolute top-26 left-0 z-10 -translate-y-1/2 bg-white/20 transition-colors hover:bg-white/30' />
          <CarouselNext className='absolute top-26 right-0 z-10 -translate-y-1/2 bg-white/20 transition-colors hover:bg-white/30' />
        </div>

        <CarouselContent className='-ml-1'>
          {cards.map((card, index) => (
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
              <motion.div className='bg-secondary-new-500 overflow-hidden rounded-lg'>
                {/* Image and Basic Info */}
                <div className='relative h-48'>
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                    className='object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                  <div className='absolute bottom-0 w-full p-3 text-white'>
                    <h3 className='font-semibold'>{card.name}</h3>
                    <p className='text-sm opacity-90'>{card.desc}</p>
                    <p className='text-xs opacity-75'>
                      CS {card.angkatan} | Universitas Gadjah Mada
                    </p>
                  </div>
                </div>

                {/* Expandable Description */}
                <motion.div
                  className='bg-secondary-new-500 relative'
                  animate={{
                    height: expandedIndex === index ? 'auto' : '40px',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className='absolute inset-0 cursor-pointer'
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                  />
                  <AnimatePresence mode='wait'>
                    {expandedIndex === index ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='p-4 text-sm text-white'
                      >
                        {card.what}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='p-4 text-sm text-white opacity-60'
                      >
                        Klik untuk baca lebih lanjut...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default SwiperWireframe
