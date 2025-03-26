import AlumniCarousel from '@/components/alumni-carousel'
import Container from '@/components/container'
import Heading from '@/components/home/heading'
import { ALUMNI } from '@/lib/helpers/alumni'

const Enthusiasts = ({ dominantCareer }: { dominantCareer: string }) => {
  return (
    <Container className='my-20 gap-10 md:gap-16'>
      <Heading className='self-center text-center'>
        <span className='font-semibold text-blue-600'>{dominantCareer}</span>{' '}
        Enthusiasts, dari mahasiswa hingga alumni
      </Heading>
      <AlumniCarousel alumni={ALUMNI.filter((alumni) => alumni.division === dominantCareer.toLowerCase())} />
    </Container>
  )
}

export default Enthusiasts
