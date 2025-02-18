import Image from 'next/image'
import Link from 'next/link'
import * as motion from 'motion/react-client'

import BlurCard from '@/components/blur-card'
import Container from '@/components/container'
import { Button } from '@/components/ui/button'
import { Scale } from 'lucide-react'

const CARD_ITEMS = [
  {
    name: 'CSTryOuts',
    description:
      'Jangan tunda lagi dan buktikan bahwa kamu siap menaklukkan tantangan UTBK!',
    cta: 'Coba TryOut',
    href: '/tryout',
  },
  {
    name: 'Career Match Up',
    description: 'Temukan Karier yang Tepat, Bangun Masa Depan Berkualitas!',
    cta: 'Career Match Up',
    href: '/career-match-up',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const cardContainerVariants = {
  hidden: {},
  visible: {},
}

const cardVariants = {
  hidden: {
    scale: 0.9,
  },
  visible: {
    scale: 1,
    transition: {
      type: 'tween',
      duration: 1,
    },
  },
}

const Hero = () => {
  return (
    <main className='bg-primary-500 relative'>
      <Container className='flex flex-col items-center gap-4 py-8 text-center text-white md:flex-row md:py-10 md:text-start'>
        <motion.section
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='z-10 flex w-full flex-col gap-2 pt-16 pb-4 md:py-0'
        >
          <motion.h1
            variants={childVariants}
            className='text-2xl font-bold md:text-3xl'
          >
            Waktunya Uji Kemampuan & Temukan Bidang yang Cocok Untukmu
          </motion.h1>
          <motion.p variants={childVariants} className='font-light'>
            Jelajahi Karir Impian di Dunia Computer Science dan Taklukkan UTBK
            2025 Bersama Fahmi
          </motion.p>
        </motion.section>

        <motion.section
          variants={cardContainerVariants}
          initial='hidden'
          animate='visible'
          className='relative z-10 grid w-full shrink-0 grid-cols-1 gap-4 md:w-auto md:grid-cols-2 md:gap-8'
        >
          {CARD_ITEMS.map((card, i) => (
            <motion.div key={i}>
              <Card {...card} />
            </motion.div>
          ))}
        </motion.section>
      </Container>
      {/* background image + overlay */}
      <Image
        src={`/hero.jpg`}
        alt='hero image isi lagi nanti'
        fill
        priority
        sizes='80%'
        className='z-0 object-cover'
      />
      <div className='bg-primary-new-500/50 absolute inset-0 z-0' />
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ type: 'tween', duration: 0.5 }}
        className='pointer-events-none absolute inset-0 z-50 bg-neutral-950'
      />
    </main>
  )
}

const Card = ({
  name,
  description,
  cta,
  href,
}: {
  name: string
  description: string
  cta: string
  href: string
}) => (
  <BlurCard className='w-full justify-between md:aspect-[5/10] md:max-w-56 xl:aspect-[4/5] lg:max-w-xs xl:max-w-sm md:py-8'>
    <section className='flex h-full flex-row items-center gap-4 md:flex-col md:items-center md:justify-evenly'>
      <div />

      {/* image */}
      <div className='relative aspect-square h-16 md:h-40 lg:h-48 xl:h-64'>
        <Image src={`/robot.png`} alt={name} fill className='object-contain' />
      </div>

      {/* text and cta */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold'>{name}</h1>
        <p className='mb-4 text-sm font-light'>{description}</p>
      </div>
    </section>
    <Link href={href}>
      <Button variant={`default`} className='w-full hover:cursor-pointer'>
        {cta}
      </Button>
    </Link>
  </BlurCard>
)

export default Hero
