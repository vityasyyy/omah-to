'use client'
import AlumniCarousel from '@/components/alumni-carousel'
import Container from '@/components/container'
import Heading, { HeadingSpan } from '@/components/home/heading'
import { ALUMNI } from '@/lib/helpers/alumni'

const Inspiration = () => {

  return (
    <Container className='my-20 gap-10 md:gap-16'>
      <Heading className='self-center text-center'>
        Inspirasi dari Para Ahli <HeadingSpan> Computer Science </HeadingSpan>
      </Heading>
      <AlumniCarousel alumni={ALUMNI} />
    </Container>
  )
}

export default Inspiration
