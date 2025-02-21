import Container from '@/components/container'
import { Instagram, Mail, Phone } from 'lucide-react'
import Image from 'next/image'

const CONTACTS = [
  {
    icon: <Phone strokeWidth={2} className='size-5' />,
    text: '(+62)800-000-000',
  },
  {
    icon: <Mail strokeWidth={2} className='size-5' />,
    text: 'xxx@gmail.com',
  },
  {
    icon: <Instagram strokeWidth={2} className='size-5' />,
    text: '@xxxx',
  },
]

const Footer = () => {
  return (
    <main className='mt-8 bg-[#304A91]'>
      <Container className='py-8 '>
        <section className='grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-3'>
          <InfoSection />
          <ContactSection />
        </section>
        <div className='w-full bg-white h-16 mt-4' />
      </Container>
    </main>
  )
}

const InfoSection = () => {
  return (
    <main className='flex flex-col gap-4 font-semibold'>
      {/* title + image */}
      <div className='flex items-center gap-4'>
        <div className='relative aspect-square h-7'>
          <Image
            src='/placeholder.png'
            alt='logo'
            fill
            sizes='100%'
            className='object-cover'
          />
        </div>
        <h1 className='font-bold! text-white'>omah-to</h1>
      </div>

      {/* body text */}
      <div className='space-y-4 text-sm text-balance text-white'>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque alias
          nam perferendis, nihil voluptatem explicabo veniam aspernatur fugiat
          fugit sunt totam qui neque quam ipsam doloribus rerum facere quas
          ipsum?
        </p>

        <p>@ 2025 XX</p>
      </div>
    </main>
  )
}

const ContactSection = () => {
  return (
    <main className='flex md:col-start-3 flex-col gap-4 text-sm font-semibold text-balance text-white'>
      <p className='text-balance'>
        Gedung Fakultas MIPA UGM Sekip Utara,Bulaksumur, Sinduadi, Mlati,
        Sleman, DI Yogyakarta
      </p>

      {CONTACTS.map((contact, i) => (
        <div key={i} className='flex items-center gap-3'>
          {contact.icon}
          <p>{contact.text}</p>
        </div>
      ))}
    </main>
  )
}

export default Footer
