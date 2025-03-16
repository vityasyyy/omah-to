import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href={`/`} className='flex items-center gap-4'>
      <div className='relative size-8'>
        <Image
          src='/assets/default-robot.webp'
          alt='logo'
          fill
          sizes='100%'
          className='object-cover'
        />
      </div>
      <div className='flex flex-col justify-center gap-0'>
        <h1 className='text-primary text-primary-700 font-bold'>PowerTOBK</h1>
        <h2 className='text-xs font-semibold text-black'>
          by Computer Science UGM
        </h2>
      </div>
    </Link>
  )
}

export default Logo
