import BlurCard from '@/components/blur-card'
import Image from 'next/image'

const AuthRightAlignedLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <main className='grid h-full grid-cols-1 md:grid-cols-2'>
      <section className='flex h-[30vh] items-center justify-center md:h-auto'>
        <BlurCard className='p-12 hidden md:flex'>
          <Image
            src={`/robot.png`}
            alt='Robot'
            width={250}
            height={250}
          />
        </BlurCard>
      </section>
      <section className='flex h-full flex-col items-center justify-center gap-6 rounded-t-2xl bg-white p-6 text-center md:overflow-y-auto md:rounded-l-2xl md:rounded-tr-none md:p-8'>
        {children}
      </section>
    </main>
  )
}

export default AuthRightAlignedLayout
