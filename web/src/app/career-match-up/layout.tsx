'use client'

import Container from '@/components/container'
import Navbar from '@/components/home/navbar'
import { usePathname } from 'next/navigation'
const CareerMatchUpLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

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
