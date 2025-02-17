const AuthRightAlignedLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <main className='grid h-full grid-cols-1 md:grid-cols-2'>
      <section className='h-[30vh] md:h-auto' />
      <section className='flex h-full flex-col items-center justify-center gap-6 rounded-t-2xl bg-white p-6 text-center md:overflow-y-auto md:rounded-l-2xl md:rounded-tr-none md:p-8'>
        {children}
      </section>
    </main>
  )
}

export default AuthRightAlignedLayout
