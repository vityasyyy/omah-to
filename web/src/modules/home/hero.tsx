'use client'
import * as motion from 'motion/react-client'
import Link from 'next/link'

import Container from '@/components/container'
import StyledCard from '@/components/tryout/styled-card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Book } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

const CARD_ITEMS = [
  {
    title: (
      <>
        <Book className='mr-2 inline bg-neutral-200 p-0.5' />
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
        <Book className='mr-2 inline bg-neutral-200 p-0.5' />
        Career Match Up
      </>
    ),
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
  const { data: session } = useSession()
  console.log(session);

  return (
    <main className='bg-white'>
      <Container className='flex flex-col gap-0 py-8 text-center text-black md:py-10 md:text-start'>
        <section className='relative flex justify-between gap-8 md:mt-4'>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='z-10 flex w-full max-w-none flex-col gap-2 self-start pt-4 pb-12 md:max-w-lg md:gap-6 md:py-0'
          >
            {session?.user && (
              <motion.h2 variants={childVariants} className='-mb-2'>
                Hello, <span className='font-bold'>{session.user?.email}</span>!
              </motion.h2>
            )}
            <motion.h1
              variants={childVariants}
              className='text-2xl font-normal text-balance md:text-3xl'
            >
              Saatnya kamu <Span>uji kemampuan</Span> & temukan
              <Span> bidang yang paling cocok </Span>untukmu
            </motion.h1>
            <motion.p
              variants={childVariants}
              className='font-light text-balance'
            >
              Jelajahi Karir Impian di Dunia Computer Science dan Taklukkan UTBK
              2025 Bersama Fahmi
            </motion.p>
          </motion.div>

          {/* images */}
          <div className='relative hidden h-[250px] w-full justify-center items-center self-end md:flex'>
            {/* person */}
            <Image
              src={`/bron.png`}
              alt='OmahTO Hero Image'
              fill
              sizes='80%'
              className='z-10 mr-24 object-contain'
            />

            {/* bg */}
            <Image
              src={`/ellipse.svg`}
              alt='OmahTO Hero Image'
              fill
              sizes='20%'
              className='z-0 object-contain'
            />
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

const Span = (props: { children?: string }) => (
  <span className='text-primary-700 font-bold'>{props.children}</span>
)

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
    className='w-full justify-between border-2 pb-2 *:text-black!'
  >
    <section className='-mt-2 flex h-full flex-col gap-4 text-start'>
      {/* text and cta */}
      <p className='text-sm font-light'>{description}</p>
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: 'tertiary' }),
          'mt-1 ml-auto px-8 hover:cursor-pointer'
        )}
      >
        {cta}
      </Link>
    </section>
  </StyledCard>
)

export default Hero
