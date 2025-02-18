'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

  return (
    <div className='relative flex items-center justify-center space-x-4 overflow-hidden p-4 pb-0'>
      {/* Left Button */}
      <button className='absolute left-0 z-10 rounded-full bg-gray-300 p-2'>
        <ChevronLeft />
      </button>

      {/* Card Container */}
      <div className='flex space-x-4 overflow-x-auto p-2'>
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={`bg-secondary-new-500 relative flex h-auto w-40 cursor-pointer flex-col overflow-hidden rounded-lg ${expandedIndex === index ? 'auto' : ''}`}
          >
            {/* Image Container */}
            <div className='relative h-48 w-auto'>
              <Image
                src={card.image}
                alt={card.name}
                fill
                sizes='50%'
                className='absolute aspect-[307/370] rounded-lg object-cover'
              />
              {/* Content Container */}
              <div className='absolute bottom-0 w-full p-2 text-white'>
                <h3 className='text-sm font-semibold'>{card.name}</h3>
                <p className='text-xs'>{card.desc}</p>
                <p className='text-[10px] opacity-80'>
                  CS {card.angkatan} | Universitas Gadjah Mada
                </p>
              </div>
            </div>

            <motion.div
              className='cursor-pointer text-xs'
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
              animate={{
                height: expandedIndex === index ? 'auto' : '40px', // atau sesuaikan dengan height yang diinginkan
              }}
              transition={{ duration: 0.3 }}
            >
              {expandedIndex !== index ? (
                <p className='truncate px-5 pt-2 pb-5 text-white'>
                  Klik untuk baca lebih lanjut...
                </p>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className='px-5 pt-2 pb-5 text-white'
                >
                  {card.what}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Right Button */}
      <button className='absolute right-0 z-10 rounded-full bg-gray-300 p-2'>
        <ChevronRight />
      </button>
    </div>
  )
}

export default SwiperWireframe
