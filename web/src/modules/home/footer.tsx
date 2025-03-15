import Container from '@/components/container'
import Logo from '@/components/home/logo'
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
    <main className='bg-primary-100 mt-8'>
      <Container className='py-8'>
        <section className='grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8'>
          <InfoSection />
          <ContactSection />
        </section>
        <div className='mt-4 flex h-16 w-full items-center justify-center bg-white'></div>
      </Container>
    </main>
  )
}

const InfoSection = () => {
  return (
    <main className='flex flex-col gap-4 font-semibold'>
      {/* title + image */}
      <Logo />

      {/* body text */}
      <div className='space-y-4 text-sm text-balance'>
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
    <main className='flex flex-col gap-4 text-sm font-semibold text-balance md:col-start-3'>
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
