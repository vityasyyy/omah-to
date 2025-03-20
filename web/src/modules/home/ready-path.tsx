import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Heading, { HeadingSpan } from '@/components/home/heading'
import SoftCircle from '@/components/soft-circle'
import { fetchUser } from '@/app/fetch_user'
import { User } from '@/lib/types/types'

const ReadyPath = async () => {
  const user: User = await fetchUser()

  return (
    <section className='bg-white px-4 py-32 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-4xl text-center'>
        {/* Robot Image */}
        <div className='relative mx-auto mb-12 size-60 md:size-96'>
          <Image
            src='/assets/fullbody_2.webp'
            alt='Robot Illustration'
            fill
            sizes='10%'
            className='z-10 translate-x-4 object-contain'
          />
          <SoftCircle />
        </div>

        {user ? (
          <>
            {/* Title */}
            <Heading>
              Langkahmu udah sejauh ini, <HeadingSpan>eksplor lebih lanjut</HeadingSpan> dan <HeadingSpan>tunjukan potensimu</HeadingSpan>!
            </Heading>
          </>
        ) : (
          <>
            {/* Title */}
            <Heading>
              Siap <HeadingSpan>menemukan</HeadingSpan> dan
              <HeadingSpan> menemukan</HeadingSpan> jalurmu?
            </Heading>

            {/* Subtitle */}
            <p className='mt-3 text-xl text-black'>
              Temukan Potensimu, Rancang Masa Depanmu!
            </p>

            {/* Button */}
            <Link href='/register' passHref className='mt-4 block'>
              <Button variant={`tertiary`} size={`lg`} className='px-10'>
                Daftar Sekarang
              </Button>
            </Link>
          </>
        )}
      </div>
    </section>
  )
}

export default ReadyPath
