import BackLink from '@/components/back-link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'

const AuthLeftAlignedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='grid h-full grid-cols-1 md:grid-cols-2'>
      <section className='flex h-[40vh] items-end justify-center overflow-clip md:order-2 md:h-auto'>
        <Image
          src={`/assets/fullbody_2.webp`}
          alt='Robot'
          width={450}
          height={450}
          className='z-0 translate-y-14 px-8 max-[768px]:size-60 md:translate-y-12'
        />
      </section>
      <section className='z-10 flex h-full flex-col items-center justify-center gap-6 rounded-t-2xl bg-white p-6 text-center md:overflow-y-auto md:rounded-tl-none md:rounded-r-2xl md:p-8'>
        <BackLink className='mx-auto mb-auto flex w-full max-w-lg justify-start'>
          <Button variant='outline' className='border-primary-200 items-center'>
            <ChevronLeft className='size-4' /> Kembali
          </Button>
        </BackLink>
        {children}
        {/* stupid thing that makes the layout work DONT DELETE  */}
        <div className='mb-auto' />
      </section>
    </main>
  )
}

export default AuthLeftAlignedLayout
