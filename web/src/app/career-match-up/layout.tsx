import Container from '@/components/container'
import Navbar from '@/components/home/navbar'
import Footer from '@/modules/home/footer'

const CareerMatchUpLayout = ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug?: string[] }
}) => {
  const pathname = params?.slug ? `/${params.slug.join('/')}` : '/'
  if (pathname === '/career-match-up/result') {
    return (
      <main>
        <Navbar />
        {children}
        <Footer />
      </main>
    )
  }

  return (
    <main className='min-h-screen'>
      <Navbar />
      <Container>{children}</Container>
    </main>
  )
}

export default CareerMatchUpLayout
