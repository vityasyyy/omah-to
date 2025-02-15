import StyledCard from '@/components/tryout/styled-card'
import { Button } from '@/components/ui/button'
import { Layers } from 'lucide-react'
import Image from 'next/image'

const POINTS = [
  {
    icon: <Layers className='h-4 w-4' />,
    title: '7 Subtest UTBK',
  },
  {
    icon: <Layers className='h-4 w-4' />,
    title: '7 Subtest UTBK',
  },
  {
    icon: <Layers className='h-4 w-4' />,
    title: '7 Subtest UTBK',
  },
  {
    icon: <Layers className='h-4 w-4' />,
    title: '7 Subtest UTBK',
  },
  {
    icon: <Layers className='h-4 w-4' />,
    title: '7 Subtest UTBK',
  },
  {
    icon: <Layers className='h-4 w-4' />,
    title: '7 Subtest UTBK',
  },
]

const StartCard = () => {
  return (
    <StyledCard title='TryOut' className='col-span-3'>
      <main className='flex flex-col md:flex-row gap-6'>
        <section className='relative aspect-[4/5] w-1/3 overflow-hidden rounded-lg'>
          <Image
            src={`/hero.jpg`}
            alt='LeBron James'
            fill
            sizes='50%'
            className='object-cover'
          />
        </section>

        <section className='flex w-full flex-col gap-2 md:pt-2'>
          <h1 className='text-primary-900 text-2xl mb-1 font-bold'>
            Lakukan Tryout Sekarang
          </h1>
          {POINTS.map((point, i) => (
            <div key={i} className={`flex items-center gap-3 text-neutral-600 ${(i + 1) % 3 === 0 && 'mb-4'}`}>
              {point.icon}
              <span>{point.title}</span>
            </div>
          ))}
          <Button variant={`secondary`} className='mt-auto self-end px-6'>
            Lakukan TryOut Sekarang
          </Button>
        </section>
      </main>
    </StyledCard>
  )
}

export default StartCard
