"use client"

import Container from '@/components/container'
import Image from 'next/image'
import SwiperCard from './swiper'

const Result = ({title}: {title: string}) => {
  return (
    <main className='flex flex-col'>
      <Container>
        <div className='mb-6 flex flex-col items-center gap-2 md:mb-10'>
          <h1 className='font-bold'>Karir yang Cocok dengan Kamu adalah</h1>
          <p className='bg-secondary-new-500 w-fit px-1.5 pb-1 text-4xl font-bold text-white'>
            {title}
          </p>
        </div>
        <Image
          src='/azhari.jpg'
          alt=''
          width={1000}
          height={40}
          className='aspect-[360/232] w-full object-cover md:aspect-[1404/496]'
        />
        <p className='my-[30px] w-full text-justify text-lg font-semibold md:my-[50px]'>
          Pertransiens per vias obscuras sapientiae, viator ignotus in tenebris
          antiquitatum errat, ubi verba arcana resonant inter columnas memoriae.
          In aethere suspenso inter chaos et ordinem, conceptus ignoti
          efflorescunt sicut flores siderum, formantes nexus incomprehensibiles
          inter finitum et infinitum. Quisquis intrat hanc aulam cogitationis,
          detegit scripturas vetustatis, ubi sententiae labyrinthicae recludunt
          sigilla intelligentiae occultae. Nihil est fixum, omnia fluunt sicut
          undae in flumine temporis. Arcana mundi latent inter lineas non
          scriptas, inter vocem quae loquitur et silentium quod audit. Advena,
          si animus tuus paratus est, percipe sibilos ventorum cognitionis, audi
          murmura veritatis quae latent inter umbras et luminis fragmenta. Omnis
          responsio est quaestio nova, omnis finis est initium aliud. Iter tuum
          non habet terminum, sed solum transitus per portas ignotae sapientiae.
          <br />
          <br />
          Pertransiens per vias obscuras sapientiae, viator ignotus in tenebris
          antiquitatum errat, ubi verba arcana resonant inter columnas memoriae.
          In aethere suspenso inter chaos et ordinem, conceptus ignoti
          efflorescunt sicut flores siderum, formantes nexus incomprehensibiles
          inter finitum et infinitum. Quisquis intrat hanc aulam cogitationis,
          detegit scripturas vetustatis, ubi sententiae labyrinthicae recludunt
          sigilla intelligentiae occultae. Nihil est fixum, omnia fluunt sicut
          undae in flumine temporis. Arcana mundi latent inter lineas non
          scriptas, inter vocem quae loquitur et silentium quod audit. Advena,
          si animus tuus paratus est, percipe sibilos ventorum cognitionis, audi
          murmura veritatis quae latent inter umbras et luminis fragmenta. Omnis
          responsio est quaestio nova, omnis finis est initium aliud. Iter tuum
          non habet terminum, sed solum transitus per portas ignotae sapientiae.
        </p>
      </Container>
      <section className='h-[700px]'>
        <div className='mb-10 flex flex-col items-center justify-center space-x-2 text-2xl font-bold md:flex-row md:text-4xl'>
          <h1>Alumni di Bidang</h1>
          <span className='text-secondary-new-500'> Frontend Developer</span>
        </div>
        <SwiperCard />
      </section>
    </main>
  )
}



export default Result
