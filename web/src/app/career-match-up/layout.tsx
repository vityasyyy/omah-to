import Container from '@/components/container'
import Navbar from '@/components/home/navbar'
const CareerMatchUpLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='bg-secondary-new-500 min-h-screen'>
      <Navbar />
      <Container>{children}</Container>
    </main>
  )
}

export default CareerMatchUpLayout
