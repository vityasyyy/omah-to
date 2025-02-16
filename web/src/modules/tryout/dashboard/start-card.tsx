'use client'
import StyledCard from '@/components/tryout/styled-card'
import { Button } from '@/components/ui/button'
import { Layers, X } from 'lucide-react'
import Image from 'next/image'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  const handleStart = () => {
    router.push('/tryout/intro')
  }

  return (
    <StyledCard title='TryOut' className='col-span-3'>
      <main className='flex h-full flex-col gap-6 md:flex-row'>
        <section className='relative h-24 w-full overflow-hidden rounded-xl md:aspect-[6/7] md:h-auto md:max-w-[22rem]'>
          <Image
            src={`/hero.jpg`}
            alt='LeBron James'
            fill
            sizes='50%'
            className='object-cover'
          />
        </section>

        <section className='flex w-full flex-col gap-2 md:pt-2'>
          <h1 className='mb-1 text-xl font-bold text-primary-900 md:text-2xl'>
            Lakukan Tryout Sekarang
          </h1>
          {POINTS.map((point, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 text-sm text-neutral-600 ${(i + 1) % 3 === 0 && 'mb-4'}`}
            >
              {point.icon}
              <span>{point.title}</span>
            </div>
          ))}
        <StartButton />
        </section>

      </main>
    </StyledCard>
  )
}

const StartButton = () => {
  const router = useRouter()

  function handleStart() {
    router.push('/tryout/intro')
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
          <Button variant={`secondary`} className='mt-auto self-end px-6'>
            Lakukan TryOut Sekarang
          </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Mulai Tryout?
            <AlertDialogCancel
              asChild
              className='my-auto h-auto border-none p-1'
            >
              <X className='text-neutral-500' />
            </AlertDialogCancel>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tryout akan dimulai tanpa jeda untuk 7 subtest dengan jangka waktu selama 195 menit, semoga berhasil! 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Kembali</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleStart()}>
            Mulai Tryout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default StartCard
