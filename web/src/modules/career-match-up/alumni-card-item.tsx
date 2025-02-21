import { motion } from 'motion/react'
import Image from 'next/image'
import React from 'react'

export type Card = {
  image: string
  name: string
  desc: string
  angkatan: string
  what: string
}

type CardItemProps = {
  card: Card
  isExpanded: boolean
  onToggle: () => void
}

const AlumniCardItem = React.memo(
  ({ card, isExpanded, onToggle }: CardItemProps) => {
    return (
      <motion.div className='bg-secondary-new-500 overflow-hidden rounded-3xl'>
        {/* Image and Basic Info */}
        <div className='relative h-72'>
          <Image
            src={card.image}
            alt={card.name}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
            className='rounded-3xl object-cover'
          />
          <div className='absolute inset-0 rounded-b-3xl bg-gradient-to-t from-black/10 to-transparent' />
          <div className='absolute bottom-0 w-full space-y-1 p-3 text-white'>
            <h3 className='w-fit bg-[#212152] px-1 font-semibold'>
              {card.name}
            </h3>
            <p className='w-fit bg-[#212152] px-1 text-sm'>{card.desc}</p>
            <p className='w-fit bg-[#212152] px-1 text-xs'>
              CS {card.angkatan} | Universitas Gadjah Mada
            </p>
          </div>
        </div>

        {/* Expandable Description */}
        <motion.div
          className='bg-secondary-new-500 relative flex min-h-[42px] items-center overflow-hidden'
          animate={{ height: isExpanded ? 'auto' : '42px' }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <div className='absolute inset-0 cursor-pointer' onClick={onToggle} />
          <motion.div
            key={isExpanded ? 'expanded' : 'collapsed'}
            initial={{ opacity: 0, y: isExpanded ? 4 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isExpanded ? 4 : 0 }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={`px-4 text-sm text-white ${isExpanded ? 'w-full py-3' : 'opacity-60'}`}
          >
            {isExpanded ? card.what : 'Klik untuk baca lebih lanjut...'}
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }
)

AlumniCardItem.displayName = 'AlumniCardItem'
export default AlumniCardItem
