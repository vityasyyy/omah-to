import Container from '@/components/container'
import TopBar from '@/components/tryout/top-bar'
import NumberCarousel from '@/modules/tryout/number-carousel'
import TryoutStatus from '@/modules/tryout/tryout-status'

const TryoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='bg-neutral-25 min-h-screen'>
      <Container>
        <TopBar />
        <TryoutStatus title='Pengetahuan Umum' />
        <NumberCarousel />
        {children}
      </Container>
    </main>
  )
}

export default TryoutLayout
