import Image from 'next/image'

const AuthRightAlignedLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <main className='grid h-full grid-cols-1 md:grid-cols-2'>
      <section className='flex overflow-clip h-[40vh] items-end justify-center md:h-auto'>
          <Image
            src={`/assets/fullbody_2.webp`}
            alt='Robot'
            width={450}
            height={450}
            className='translate-y-14 max-[768px]:size-60  md:translate-y-12 z-0 px-8'
          />
      </section>
      <section className='flex h-full z-10 flex-col items-center justify-center gap-6 rounded-t-2xl bg-white p-6  text-center md:overflow-y-auto md:rounded-l-2xl md:rounded-tr-none md:p-8'>
        {children}
      </section>
    </main>
  )
}

export default AuthRightAlignedLayout
