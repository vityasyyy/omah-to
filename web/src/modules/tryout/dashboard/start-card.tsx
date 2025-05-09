'use client'
import StyledCard from '@/components/tryout/styled-card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Book, CircleAlert, CircleX, Clock, Layers, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
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
import { startTryout } from '@/lib/fetch/tryout-test'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const POINTS = [
  {
    icon: <Layers className="h-4 w-4" />,
    title: "7 Subtest UTBK",
  },
  {
    icon: <Clock className="h-4 w-4" />,
    title: (
      <>
        195 Menit tanpa jeda,{" "}
        <span className="text-primary-700 font-bold">
          Peserta hanya dapat melanjutkan subtest sesuai waktu
        </span>
      </>
    ),
  },
  {
    icon: <Book className="h-4 w-4" />,
    title: "Penilaian serta kunci jawaban di akhir pengerjaan",
  },
  {
    icon: <CircleAlert className="h-4 w-4" />,
    title: "Pastikan membaca soal dengan teliti",
  },
  {
    icon: <CircleX className="h-4 w-4" />,
    title: (
      <>
        Peserta{" "}
        <span className="text-primary-700 font-bold">dapat melihat hasil</span> ketika{" "}
        <span className="text-primary-700 font-bold">waktu sesi habis</span>
      </>
    ),
  },
  {
    icon: <CircleX className="h-4 w-4" />,
    title: "Dilarang bekerja sama, membuka situs lain, atau mengakses tryout menggunakan perangkat lain",
  },
  {
    icon: <CircleX className="h-4 w-4" />,
    title: (
      <>
        <span className="text-primary-700 font-bold">
          Dilarang keluar dari website
        </span>{" "}
        selama try-out berlangsung
      </>
    ),
  },
];


const StartCard = ({ status }: { status: 'none' | 'ongoing' | 'finished' }) => {
  return (
    <StyledCard title='TryOut' className='col-span-3'>
      <main className='flex h-full flex-col gap-6 md:flex-row'>
        <section className='relative h-24 w-full overflow-hidden rounded-xl md:aspect-6/7 md:h-auto md:max-w-[22rem]'>
          <Image
            src={`/assets/subtests/ppu.webp`}
            alt='TryOut'
            fill
            sizes='50%'
            className='object-cover'
          />
        </section>
        <section className='flex w-full flex-col gap-2 md:pt-2'>
          <h1 className='text-primary-900 mb-1 text-xl font-bold md:text-2xl'>
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

          {/* Conditional Button Rendering */}
          {status === 'none' && <StartButton />}
          {status === 'ongoing' && <ResumeButton />}
          {status === 'finished' && <PembahasanButton />}
        </section>
      </main>
    </StyledCard>
  )
}

const StartButton = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleStart() {
    setIsLoading(true)
    try {
      const resTest = await startTryout('', true)
      if (!resTest) {
        console.error('Failed to start tryout')
        return
      }
      router.push('/tryout/intro')
    } catch (error) {
      console.error('Error starting tryout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={`secondary`} className='mt-auto self-end px-6' disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memulai...
            </>
          ) : (
            'Lakukan TryOut Sekarang'
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className='flex items-center justify-between'>
            <AlertDialogTitle>Mulai Tryout?</AlertDialogTitle>
            <AlertDialogCancel
              asChild
              className='my-auto h-auto border-none p-1'
            >
              <X className='text-neutral-500' />
            </AlertDialogCancel>
          </div>
          <AlertDialogDescription>
            Tryout akan dimulai tanpa jeda untuk 7 subtest dengan jangka waktu
            selama 195 menit, semoga berhasil!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Kembali</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleStart()} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memulai...
              </>
            ) : (
              'Mulai Tryout'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const ResumeButton = () => {
  return (
    <Link
    href={`/tryout/intro`}
      className={cn(buttonVariants({ variant: 'secondary'}), 'mt-auto self-end px-6')}
    >
      Lanjutkan Tryout
    </Link>
  )
}

const PembahasanButton = () => {
  return (
    <Link
      href={`/tryout/pembahasan`}
      className={cn(buttonVariants({ variant: 'secondary'}), 'mt-auto self-end px-6')}
    >
      Lihat Pembahasan
    </Link>
  )
}

export default StartCard
