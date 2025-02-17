import Navbar from '@/components/home/navbar'
import Hero from '@/modules/home/hero'
import WhyCompsci from '@/modules/home/why-compsci'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyCompsci />
    </>
  )
}
