import React from 'react'
import Image from 'next/image'
import {ArrowUpRight, X} from 'lucide-react'
import Container from '@/components/container'
import { Button } from '@/components/ui/button'
import StyledCard from '@/components/tryout/styled-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const TryoutResult = () => {
  return (
    <Container>
      <h1 className='text-primary-900 mt-9 mb-4.5 text-center text-2xl font-bold md:mb-7'>
        Hasil TryOut
      </h1>
      <Statistic />
      {/* <Pembahasan title='Jawaban' subtest='PU' /> */}
      <div className='space-y-6'>
        {DUMMY_ANSWER.map((subtestData) => (
          <Pembahasan
            key={subtestData.subtest}
            title={`Jawaban ${subtestData.subtest}`}
            subtest={subtestData.subtest}
          />
        ))}
      </div>
    </Container>
  )
}

const Statistic = () => {
  return (
    <div className='grid w-full grid-cols-1 gap-6 xl:grid-cols-4'>
      <div className='col-span-3 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:col-span-1 xl:grid-cols-1'>
        <ResultTable title='Hasil'>
          <div className='grid grid-cols-2 gap-2.5 *:text-center'>
            <div className='rounded-lg bg-white'>
              <div className='px-auto pt-1 pb-1 font-medium text-black'>
                <p className='text-primary-900 text-[3rem] font-bold sm:text-[4rem]'>
                  11
                </p>
                / 1000
              </div>
              <p className='border-t border-neutral-200 pt-1.5 pb-2.5 text-black'>
                Total Skor
              </p>
            </div>
            <div className='rounded-lg bg-white'>
              <div className='px-auto pt-1 pb-1 font-medium text-black'>
                <p className='text-primary-900 text-[3rem] font-bold sm:text-[4rem]'>
                  11
                </p>
                / 1000
              </div>
              <p className='border-t border-neutral-200 pt-1.5 pb-2.5 text-black'>
                Total Skor
              </p>
            </div>
          </div>
        </ResultTable>
        <section className='border-primary-500 bg-primary-900 relative h-48 rounded-xl border p-4 text-white *:text-left md:h-auto xl:h-48'>
          <p className='text-2xl font-bold sm:text-3xl 2xl:text-4xl'>
            Kamu 
            <br className='xl:hidden' />
            {' '}Keren!
          </p>
          <br className='hidden 2xl:block' />
          <p className='text-sm font-light mr-52'>
            Perjuangkan nilaimu, dan sampai jumpa di Universitas Gadjah Mada
          </p>
          <Image
            src={`/kamu-keren-model.png`}
            alt=''
            width={210}
            height={0}
            className='inset-Y-0 absolute right-0 bottom-0 w-48'
          />
        </section>
      </div>
      <StatisticTable className='col-span-3 px-6' />
    </div>
  )
}

type ResultTableProps = {
  title?: string
  subtest?: string
  children?: React.ReactNode
  className?: string
}

const ResultTable = (props: ResultTableProps) => {
  return (
    <main
      className={cn(
        'overflow-hidden rounded-2xl bg-gradient-to-b from-[#00359E] to-[#001338] px-4 py-4 shadow-xs',
        props.className
      )}
    >
      <header className='flex h-fit w-full justify-between pb-2 text-sm font-bold text-white md:text-base'>
        <span>{props.title || 'Title'}</span>
        {props.subtest && (
          <span className='text-neutral-500'>Subtest: {props.subtest}</span>
        )}
      </header>

      {/* content goes here */}
      <div className='mb-2 h-full text-sm font-bold text-white md:text-base'>
        {props.children}
      </div>
    </main>
  )
}

const Pembahasan = ({
  title,
  className,
  subtest,
}: {
  title?: string
  className?: string
  subtest?: string
}) => {
  const selectedSubtest = DUMMY_ANSWER.find((item) => item.subtest === subtest)

  return (
    <StyledCard title={title} className={className} subtest={subtest}>
      <ScrollArea className='h-full w-full overflow-hidden rounded-lg border border-neutral-200'>
        <Table>
          {!selectedSubtest && (
            <TableCaption className='mt-12 text-lg font-bold text-black'>
              Subtest tidak ditemukan atau belum ada data.
            </TableCaption>
          )}

          {selectedSubtest && (
            <>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-nowrap'>No.</TableHead>
                  <TableHead>Jawaban kamu</TableHead>
                  <TableHead className='text-center'>Pembahasan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSubtest.qna.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className='text-center font-medium'>
                      {data.no}
                    </TableCell>
                    <TableCell className='w-full text-left'>
                      {data.jawaban}
                    </TableCell>
                    <TableCell className='w-24 text-center'>
                      <PembahasanButton data={data} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </ScrollArea>
    </StyledCard>
  )
}

interface QnaType {
  no: number
  jawaban: string
  pembahasan: string
}

const PembahasanButton = ({ data }: { data: QnaType }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span>
          <Button variant='pembahasan' className='md:block hidden self-center text-white'>
            Lihat Pembahasan
          </Button>
          <Button variant='pembahasan' className='md:hidden self-center text-white'>
            <ArrowUpRight strokeWidth={3} />
          </Button>
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Pembahasan Soal Nomor {data.no}
            <AlertDialogCancel
              asChild
              className='my-auto h-auto border-none p-1'
            >
              <X className='text-neutral-500' />
            </AlertDialogCancel>
          </AlertDialogTitle>
          <AlertDialogDescription>{data.pembahasan}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Kembali</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const StatisticTable = ({ className }: { className?: string }) => {
  const leftData = DUMMY_STATISTIC.slice(0, 4)
  const rightData = DUMMY_STATISTIC.slice(4)

  const totalBenar = DUMMY_STATISTIC.reduce(
    (sum, data) => sum + data.jml_benar,
    0
  )
  const totalSkor = DUMMY_STATISTIC.reduce((sum, data) => sum + data.skor, 0)

  return (
    <StyledCard title='Statistik Nilai' className={className}>
      <div className='flex flex-col gap-5 lg:flex-row lg:gap-9'>
        {/* Left Side */}
        <ScrollArea className='h-full w-full overflow-hidden rounded-lg border border-neutral-200'>
          <Table>
            {leftData.length === 0 && (
              <TableCaption className='mt-12 text-lg font-bold text-black'>
                Kamu belum melakukan tes.
              </TableCaption>
            )}
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Subtest</TableHead>
                <TableHead>Benar</TableHead>
                <TableHead>Skor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leftData.map((data) => (
                <TableRow key={data.subtest}>
                  <TableCell className='w-full font-medium'>
                    {data.subtest}
                  </TableCell>
                  <TableCell className='text-center'>
                    {data.jml_benar}
                  </TableCell>
                  <TableCell className='text-center'>{data.skor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {/* Right Side */}
        <ScrollArea className='h-full w-full overflow-hidden rounded-xl border border-neutral-200'>
          <Table>
            {rightData.length === 0 && (
              <TableCaption className='mt-12 text-lg font-bold text-black'>
                Kamu belum melakukan tes.
              </TableCaption>
            )}
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Subtest</TableHead>
                <TableHead>Benar</TableHead>
                <TableHead>Skor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rightData.map((data) => (
                <TableRow key={data.subtest}>
                  <TableCell className='w-full font-medium'>
                    {data.subtest}
                  </TableCell>
                  <TableCell className='text-center'>
                    {data.jml_benar}
                  </TableCell>
                  <TableCell className='text-center'>{data.skor}</TableCell>
                </TableRow>
              ))}
              {/* Total Row */}
              <TableRow className='bg-gray-100 font-bold'>
                <TableCell className='text-center'>Total</TableCell>
                <TableCell className='text-center'>{totalBenar}</TableCell>
                <TableCell className='text-center'>{totalSkor}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </StyledCard>
  )
}

const DUMMY_STATISTIC = [
  {
    subtest: 'Penalaran Umum',
    jml_benar: 9,
    skor: 90,
  },
  {
    subtest: 'Pengetahuan & Pemahaman Umum',
    jml_benar: 9,
    skor: 90,
  },
  {
    subtest: 'Pemahaman Bacaan & Menulis',
    jml_benar: 9,
    skor: 90,
  },
  {
    subtest: 'Pengetahuan Kuantitatif',
    jml_benar: 9,
    skor: 90,
  },
  {
    subtest: 'Literasi Bahasa Indonesia',
    jml_benar: 9,
    skor: 90,
  },
  {
    subtest: 'Literasi Bahasa Inggris',
    jml_benar: 9,
    skor: 90,
  },
  {
    subtest: 'Penalaran Matematika',
    jml_benar: 9,
    skor: 90,
  },
]

const DUMMY_ANSWER = [
  {
    subtest: 'PU',
    qna: [
      {
        no: 1,
        jawaban: 'jawaban nomor 1',
        pembahasan: 'pembahasan nomor 1',
      },
      {
        no: 2,
        jawaban: 'jawaban nomor 2',
        pembahasan: 'pembahasan nomor 2',
      },
      {
        no: 3,
        jawaban:
          'membuktikan lokasi yang sangat buruk tetap bisa menguatkan tekad belajar Bung Karno',
        pembahasan:
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It  has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at  Hampden-Sydney College in Virginia, looked up one of the more obscure  Latin words, consectetur, from a Lorem Ipsum passage, and going through  the cites of the word in classical literature, discovered the  undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33  of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by  Cicero, written in 45 BC. This book is a treatise on the theory of  ethics, very popular during the Renaissance. The first line of Lorem  Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section  1.10.32.',
      },
      {
        no: 4,
        jawaban:
          'membuktikan lokasi yang sangat buruk tetap bisa menguatkan tekad belajar Bung Karno',
        pembahasan:
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It  has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at  Hampden-Sydney College in Virginia, looked up one of the more obscure  Latin words, consectetur, from a Lorem Ipsum passage, and going through  the cites of the word in classical literature, discovered the  undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33  of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by  Cicero, written in 45 BC. This book is a treatise on the theory of  ethics, very popular during the Renaissance. The first line of Lorem  Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section  1.10.32.',
      },
      {
        no: 5,
        jawaban:
          'membuktikan lokasi yang sangat buruk tetap bisa menguatkan tekad belajar Bung Karno',
        pembahasan:
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It  has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at  Hampden-Sydney College in Virginia, looked up one of the more obscure  Latin words, consectetur, from a Lorem Ipsum passage, and going through  the cites of the word in classical literature, discovered the  undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33  of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by  Cicero, written in 45 BC. This book is a treatise on the theory of  ethics, very popular during the Renaissance. The first line of Lorem  Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section  1.10.32.',
      },
    ],
  },
  {
    subtest: 'PPU',
    qna: [
      {
        no: 1,
        jawaban:
          'membuktikan lokasi yang sangat buruk tetap bisa menguatkan tekad belajar Bung Karno',
        pembahasan:
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It  has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at  Hampden-Sydney College in Virginia, looked up one of the more obscure  Latin words, consectetur, from a Lorem Ipsum passage, and going through  the cites of the word in classical literature, discovered the  undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33  of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by  Cicero, written in 45 BC. This book is a treatise on the theory of  ethics, very popular during the Renaissance. The first line of Lorem  Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section  1.10.32.',
      },
      {
        no: 2,
        jawaban:
          'membuktikan lokasi yang sangat buruk tetap bisa menguatkan tekad belajar Bung Karno',
        pembahasan:
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It  has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at  Hampden-Sydney College in Virginia, looked up one of the more obscure  Latin words, consectetur, from a Lorem Ipsum passage, and going through  the cites of the word in classical literature, discovered the  undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33  of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by  Cicero, written in 45 BC. This book is a treatise on the theory of  ethics, very popular during the Renaissance. The first line of Lorem  Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section  1.10.32.',
      },
      {
        no: 3,
        jawaban:
          'membuktikan lokasi yang sangat buruk tetap bisa menguatkan tekad belajar Bung Karno',
        pembahasan:
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It  has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at  Hampden-Sydney College in Virginia, looked up one of the more obscure  Latin words, consectetur, from a Lorem Ipsum passage, and going through  the cites of the word in classical literature, discovered the  undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33  of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by  Cicero, written in 45 BC. This book is a treatise on the theory of  ethics, very popular during the Renaissance. The first line of Lorem  Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section  1.10.32.',
      },
      {
        no: 4,
        jawaban:
          'membuktikan lokasi yang sangat buruk tetap bisa menguatkan tekad belajar Bung Karno',
        pembahasan:
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It  has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at  Hampden-Sydney College in Virginia, looked up one of the more obscure  Latin words, consectetur, from a Lorem Ipsum passage, and going through  the cites of the word in classical literature, discovered the  undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33  of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by  Cicero, written in 45 BC. This book is a treatise on the theory of  ethics, very popular during the Renaissance. The first line of Lorem  Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section  1.10.32.',
      },
      {
        no: 5,
        jawaban:
          'membuktikan lokasi yang sangat buruk tetap bisa menguatkan tekad belajar Bung Karno',
        pembahasan:
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It  has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at  Hampden-Sydney College in Virginia, looked up one of the more obscure  Latin words, consectetur, from a Lorem Ipsum passage, and going through  the cites of the word in classical literature, discovered the  undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33  of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by  Cicero, written in 45 BC. This book is a treatise on the theory of  ethics, very popular during the Renaissance. The first line of Lorem  Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section  1.10.32.',
      },
    ],
  },
]

export default TryoutResult
