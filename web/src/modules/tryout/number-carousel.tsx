'use client'
import SmallStyledCard from '@/components/tryout/small-styled-card'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/tryout-carousel'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NumberCarousel = () => {
  const pathname = usePathname()
  const currentNumber = pathname.slice(pathname.lastIndexOf('/') + 1)

  return (
    <SmallStyledCard className='w-full py-4'>
      <Carousel className='mx-auto w-full'>
        <section className='flex items-center gap-2'>
          <CarouselPrevious className='relative shrink-0' />
          <CarouselContent className='-ml-2 w-full'>
            {Array.from({ length: 40 }).map((_, index) => (
              <CarouselItem
                key={index}
                className='basis-[33%] pl-2 min-[400px]:basis-[25%] sm:basis-[11%] md:basis-[9%] lg:basis-[6%] xl:basis-[5%]'
              >
                <Link
                  href={`/tryout/${index + 1}`}
                  replace={true}
                  scroll={false}
                >
                  <Button
                    variant={
                      currentNumber === `${index + 1}` ? 'secondary' : 'card'
                    }
                    className='cursor-pointer'
                  >
                    <span className='font-semibold'>{index + 1}</span>
                  </Button>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className='relative shrink-0' />
        </section>
      </Carousel>
    </SmallStyledCard>
  )
}

export default NumberCarousel
