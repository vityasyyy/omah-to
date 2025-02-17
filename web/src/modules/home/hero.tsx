import BlurCard from '@/components/blur-card'
import Container from '@/components/container'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

const CARD_ITEMS = [
  {
    name: 'CSTryOuts',
    description:
      'Jangan tunda lagi dan buktikan bahwa kamu siap menaklukkan tantangan UTBK!',
    href: '/tryout',
  },
  {
    name: 'Career Match Up',
    description: 'Temukan Karier yang Tepat, Bangun Masa Depan Berkualitas!',
    href: '/career-match-up',
  },
]

const Hero = () => {
  return (
    <main className='bg-primary-500 relative'>
      <Container className='flex flex-col items-center gap-4 py-8 text-center text-white md:flex-row md:items-end md:py-10 md:text-start'>
        <section className='z-10 flex w-full flex-col gap-2 pt-16 pb-4 md:py-0'>
          <h1 className='text-2xl font-bold md:text-3xl'>
            Waktunya Uji Kemampuan & Temukan Bidang yang Cocok Untukmu
          </h1>
          <p className='font-light'>
            Jelajahi Karir Impian di Dunia Computer Science dan Taklukkan UTBK
            2025 Bersama Fahmi
          </p>
        </section>

        <section className='relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8'>
          {CARD_ITEMS.map((card, i) => (
            <Card key={i} {...card} />
          ))}
        </section>

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
      </Container>
    </main>
  )
}

const Card = ({
  name,
  description,
  href,
}: {
  name: string
  description: string
  href: string
}) => (
  <BlurCard>
    <section className='flex w-full flex-row items-center gap-4 md:flex-col md:items-center'>
      {/* image */}
      <div className='relative aspect-square h-16 md:h-40 lg:h-48'>
        <Image src={`/robot.png`} alt={name} fill className='object-contain' />
      </div>

      {/* text and cta */}
      <div className='flex flex-col gap-2 md:mt-auto'>
        <h1 className='text-2xl font-bold md:mt-auto'>{name}</h1>
        <p className='mb-4 text-sm font-light'>{description}</p>
      </div>
    </section>
    <Link href={href}>
      <Button variant={`default`} className='w-full hover:cursor-pointer'>
        {name}
      </Button>
    </Link>
  </BlurCard>
)

export default Hero
