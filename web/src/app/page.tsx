import Navbar from '@/components/home/navbar'
import Hero from '@/modules/home/hero'
import WhyCompsci from '@/modules/home/why-compsci'
import SubjectSemester from '@/modules/home/subject-semester'
// import TryoutResult from '@/modules/tryout/tryout-result'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyCompsci />
      <SubjectSemester />
      {/* <TryoutResult /> ini buat ngetes */}
    </>
  )
}
