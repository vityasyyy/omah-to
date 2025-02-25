'use client'
import Container from '@/components/container'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { useRef } from 'react'

const UtbkPerspective = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  return (
    <Container className='relative mt-12 mb-4'>
      <h1 className='text-2xl font-bold md:max-w-lg lg:text-3xl'>
        UTBK dari Perspektif Mahasiswa{' '}
        <span className='text-primary-500'> Computer Science </span>
      </h1>

      <p className='relative font-semibold'>
        Pertransiens per vias obscuras sapientiae, viator ignotus in tenebris
        antiquitatum errat, ubi verba arcana resonant inter columnas memoriae.
        In aethere suspenso inter chaos et ordinem, conceptus ignoti
        efflorescunt sicut flores siderum, formantes nexus incomprehensibiles
        inter finitum et infinitum. Quisquis intrat hanc aulam cogitationis,
        detegit scripturas vetustatis, ubi sententiae labyrinthicae recludunt
        sigilla intelligentiae occultae. Nihil est fixum, omnia fluunt sicut
        undae in flumine temporis. Arcana mundi latent inter lineas non
        scriptas, inter vocem quae loquitur et silentium quod audit. Advena, si
        animus tuus paratus est, percipe sibilos ventorum cognitionis, audi
        murmura veritatis quae latent inter umbras et luminis fragmenta. Omnis
        responsio est quaestio nova, omnis finis est initium aliud. Iter tuum
        non habet terminum, sed solum transitus per portas ignotae sapientiae.
      </p>

      {/* <Carousel
        plugins={[plugin.current]}
        className='w-full bg-transparent'
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className='relative z-10 bg-transparent'>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem
              key={index}
              className='bg-red-200 sm:basis-1/2 lg:basis-1/3'
            >
              <Card />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Container> */}
      <Carousel className='w-full bg-transparent'>
        <CarouselContent className='relative z-10 bg-transparent'>
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem
              key={i}
              className={`sm:basis-1/2 md:basis-1/3 lg:basis-1/4 ${i !== 0 && 'pl-8'}`}
            >
              <Card
                title='Fahmi Shampoerna'
                subtitle='Full Stack Engineer'
                description='CS23 | Universitas Gadjah Mada'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Container>
  )
}

const Card = ({
  title = 'Nama Mahasiswa',
  subtitle = 'CS23 Universitas Gadjah Mada',
  description = 'Lorem ipsum dolor sit amet, blablabla',
  src = '/placeholder.png',
}: {
  title?: string
  subtitle?: string
  description?: string
  src?: string
}) => {
  return (
    <main className='relative w-full rounded-lg border-4 border-neutral-200 bg-white p-3'>
      <section>
        {/* image */}
        <div className='relative aspect-square h-16 overflow-clip rounded-md'>
          <Image
            src={`/placeholder.png`}
            alt='CS Student Image'
            fill
            sizes='30%'
            className='object-cover'
          />
        </div>

        {/* header and subheader */}
        <div className='flex flex-col'>
          <h1 className='text-lg font-bold'>{title}</h1>
          <h2 className='text-base font-light'>{subtitle}</h2>
        </div>
      </section>
      <section className='py-2 text-sm'>{description}</section>
   </main> 
  )
}

export default UtbkPerspective
