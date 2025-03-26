import AlumniCarousel from '@/components/alumni-carousel'
import Container from '@/components/container'
import Heading from '@/components/home/heading'
import { ALUMNI } from '@/lib/helpers/alumni'

const Enthusiasts = ({ dominantCareer = '' }: { dominantCareer: string }) => {
  const alumni = dominantCareer ? ALUMNI.filter((alumni) => alumni.division === dominantCareer.toLowerCase()) : ALUMNI

  return (
    <Container className='my-20 gap-10 md:gap-16'>
      <Heading className='self-center text-center'>
        <span className='font-semibold text-blue-600'>{dominantCareer}</span>{' '}
        Enthusiasts, dari mahasiswa hingga alumni
      </Heading>
      <AlumniCarousel alumni={alumni} />
    </Container>
  )
}

export default Enthusiasts
