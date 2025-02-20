// components/CardItem.tsx
import { motion, AnimatePresence } from 'framer-motion'
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

const AlumniCardItem = React.memo(({ card, isExpanded, onToggle }: CardItemProps) => {
  return (
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
        animate={{ height: isExpanded ? 'auto' : '40px' }}
        transition={{ duration: 0.3 }}
      >
        <div className='absolute inset-0 cursor-pointer' onClick={onToggle} />
        <AnimatePresence mode='wait'>
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='p-4 text-sm text-white'
            >
              {card.what}
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
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
  )
})

AlumniCardItem.displayName = 'AlumniCardItem'
export default AlumniCardItem
