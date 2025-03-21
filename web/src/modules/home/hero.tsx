import * as motion from 'motion/react-client'
import Link from 'next/link'

import Container from '@/components/container'
import StyledCard from '@/components/tryout/styled-card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Book } from 'lucide-react'
import Image from 'next/image'
import Heading, { HeadingSpan } from '@/components/home/heading'
import SoftCircle from '@/components/soft-circle'
import { fetchUser } from '@/app/fetch_user'

const CARD_ITEMS = [
  {
    title: (
      <>
        <Book className='bg-primary-100 mr-2 inline p-0.5' />
        CSTryOuts
      </>
    ),
    description:
      'Jangan tunda lagi dan buktikan bahwa kamu siap menaklukkan tantangan UTBK!',
    cta: 'Coba TryOut',
    href: '/tryout',
  },
  {
    title: (
      <>
        <Book className='bg-primary-100 mr-2 inline p-0.5' />
        Career Match Up
      </>
    ),
    description: 'Temukan Karier yang Tepat, Bangun Masa Depan Berkualitas!',
    cta: 'Cari Kecocokan',
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

// const cardVariants = {
//   hidden: {
//     scale: 0.9,
//   },
//   visible: {
//     scale: 1,
//     transition: {
//       type: 'tween',
//       duration: 1,
//     },
//   },
// }

const Hero = async () => {
  const user = await fetchUser()

  return (
    <main className='bg-white'>
      <Container className='flex flex-col gap-0 py-8 text-center text-black md:py-10 md:text-start'>
        <section className='relative flex flex-col justify-between gap-8 md:mt-4 md:flex-row'>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='z-10 flex w-full max-w-none flex-col gap-2 self-center pt-4 md:max-w-lg md:gap-6 md:py-0 md:pb-12'
          >
            {user && (
              <motion.h2 variants={childVariants} className='mb-1 sm:-mb-2 text-lg'>
                Hello, <span className='font-bold'>{user.username}</span>!
              </motion.h2>
            )}
            <motion.div
              variants={childVariants}
              className='text-2xl font-normal text-balance md:text-3xl'
            >
              <Heading className='text-balance'>
                Saatnya kamu <HeadingSpan>uji kemampuan</HeadingSpan> & temukan
                <HeadingSpan> bidang yang paling cocok </HeadingSpan>untukmu!
              </Heading>
            </motion.div>
            <motion.p
              variants={childVariants}
              className='mt-2 text-sm font-light text-balance text-neutral-700 md:mt-0 md:text-black'
            >
              Jelajahi Karir Impian di Dunia Computer Science dan Taklukkan UTBK
              2025 Bersama Fahmi
            </motion.p>
          </motion.div>

          {/* images */}
          <div className='relative flex w-full items-center justify-center'>
            {/* person */}
            <Image
              src={`/assets/hero.webp`}
              alt='OmahTO Hero Image'
              width={350}
              height={250}
              className='z-10 md:self-end'
            />

            {/* bg */}
            <SoftCircle />
          </div>
        </section>

        <motion.section
          variants={cardContainerVariants}
          initial='hidden'
          animate='visible'
          className='relative z-10 grid w-full shrink-0 grid-cols-1 gap-4 md:grid-cols-2'
        >
          {CARD_ITEMS.map((card, i) => (
            <motion.div key={i}>
              <Card {...card} />
            </motion.div>
          ))}
        </motion.section>
      </Container>
    </main>
  )
}

const Card = ({
  title,
  description,
  cta,
  href,
}: {
  title: string | React.ReactNode
  description: string
  cta: string
  href: string
}) => (
  <StyledCard
    title={title}
    variant='blue'
    className='h-full w-full justify-between border-2 *:text-black!'
  >
    <section className='-mt-2 flex h-full flex-col justify-between gap-4 text-start'>
      {/* text and cta */}
      <p className='min-h-12 text-sm font-light'>{description}</p>
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: 'tertiary' }),
          'self-end px-12 hover:cursor-pointer'
        )}
      >
        {cta}
      </Link>
    </section>
  </StyledCard>
)

export default Hero
