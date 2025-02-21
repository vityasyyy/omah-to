import Navbar from '@/components/home/navbar'
import Hero from '@/modules/home/hero'
import WhyCompsci from '@/modules/home/why-compsci'
import SubjectSemester from '@/modules/home/subject-semester'
import Footer from '@/modules/home/footer'
import CompsciDivisions from '@/modules/home/compsci-divisions'
// import TryoutResult from '@/modules/tryout/tryout-result'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyCompsci />
      <CompsciDivisions />
      <SubjectSemester />
      {/* <TryoutResult /> ini buat ngetes */}
      <Footer />
    </>
  )
}
