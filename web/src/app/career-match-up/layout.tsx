import Container from '@/components/container'
import Navbar from '@/components/home/navbar'

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
      </main>
    )
  }

  return (
    <main className='bg-secondary-new-500 min-h-screen'>
      <Navbar />
      <Container>{children}</Container>
    </main>
  )
}

export default CareerMatchUpLayout
