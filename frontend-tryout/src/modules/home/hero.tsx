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
    <Container>
      <main className='flex flex-col items-center text-center md:text-start gap-4 rounded-2xl bg-primary p-6 text-white md:flex-row md:p-8'>
        <section className='flex max-w-xl flex-col gap-2 py-16 md:py-0'>
          <h1 className='text-3xl font-bold'>
            Waktunya <span className='text-secondary'> Uji Kemampuan </span> &
            Temukan <span className='text-secondary'> Bidang yang Cocok </span>
            Untukmu
          </h1>
          <p className='font-light'>
            Jelajahi Karir Impian di Dunia Computer Science dan Taklukkan UTBK
            2025 Bersama Fahmi
          </p>
        </section>

        <section className='flex w-full flex-col gap-4 md:flex-row'>
          {CARD_ITEMS.map((card, i) => (
            <Card key={i} {...card} />
          ))}
        </section>
      </main>
    </Container>
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
  <main
    className='relative flex w-full flex-col gap-2 overflow-hidden rounded-xl border-t-[2px] bg-white/20 p-6 shadow-lg *:text-start md:*:text-center md:justify-between md:py-10'
    style={{ boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5)' }}
  >
    <section className='flex w-full flex-row items-center gap-4 md:flex-col md:items-center'>
      {/* image */}
      <div className='relative aspect-square h-16 md:h-40 lg:h-48'>
        <Image src={`/robot.png`} alt={name} fill className='object-contain' />
      </div>

      {/* text and cta */}
      <div className='flex flex-col gap-2 md:mt-auto'>
        <h1 className='text-2xl font-bold md:mt-auto'>{name}</h1>
        <p className='mb-4 text-sm font-light md:text-base'>{description}</p>
      </div>
    </section>
    <Link href={href}>
      <Button variant={`secondary`} className='w-full'>
        CTA
      </Button>
    </Link>
  </main>
)

export default Hero
