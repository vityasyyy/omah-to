import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Container from '@/components/container'
import Navbar from '@/components/home/navbar'
import Footer from '@/modules/home/footer'

const NotFound = () => {
  return (
    <>
      <main className='flex min-h-screen items-center bg-white'>
        <Container>
          <Navbar />
          <div className='flex flex-col items-center justify-center gap-6 text-center'>
          <h1 className='from-primary-100 font-lora bg-gradient-to-r to-blue-600 bg-clip-text text-8xl font-bold text-transparent'>
            404
          </h1>

          <p className='text-2xl font-light  text-neutral-700'>
            Oops! Halaman yang kamu cari tidak ditemukan
          </p>

          <div>
            <Link
              href='/'
              className={cn(
                buttonVariants({ variant: 'tertiary' }),
                'px-8 hover:cursor-pointer'
              )}
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </Container>
    </main>
      <Footer />
      </>
  )
}

export default NotFound
