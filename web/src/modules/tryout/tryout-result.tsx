/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import Image from 'next/image'
import {ArrowUpRight, X} from 'lucide-react'
import Container from '@/components/container'
import { Button } from '@/components/ui/button'
import StyledCard from '@/components/tryout/styled-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
// Import KaTeX for LaTeX rendering
import 'katex/dist/katex.min.css'
import katex from 'katex'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const subtestTitles: Record<string, string> = {
  subtest_pu: 'Pengetahuan Umum',
  subtest_ppu: 'Pengetahuan dan Pemahaman Umum',
  subtest_pbm: 'Pengetahuan Membaca dan Menulis',
  subtest_pk: 'Pengetahuan Kuantitatif',
  subtest_lbi: 'Literasi Bahasa Indonesia',
  subtest_lbe: 'Literasi Bahasa Inggris',
  subtest_pm: 'Penalaran Matematika',
};
interface TryoutResultProps {
  userScores: {
    subtest: string
    score: number
  }[]
  userAnswers: {
    subtest: string
    user_answer: string
    is_correct: boolean
    text_pilihan?: string
    pembahasan: string
    kode_soal: string
  }[]
  totalRank?: number
}

const TryoutResult = ({ userScores, userAnswers, totalRank }: TryoutResultProps) => {
  // Group answers by subtest
  const groupedAnswers = userAnswers.reduce((acc, answer) => {
    const key = answer.subtest
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push({
      no: acc[key].length + 1,
      jawaban: answer.text_pilihan || answer.user_answer,
      pembahasan: answer.pembahasan,
      isCorrect: answer.is_correct
    })
    return acc
  }, {} as Record<string, Array<{ no: number, jawaban: string, pembahasan: string, isCorrect: boolean }>>)

  return (
    <Container>
      <h1 className='text-primary-900 mt-9 mb-4.5 text-center text-2xl font-bold md:mb-7'>
        Hasil TryOut
      </h1>
      <Statistic userScores={userScores} userAnswers={userAnswers} totalRank={totalRank} />
      <div className='space-y-6'>
        {Object.entries(groupedAnswers).map(([subtest, qna]) => (
          <Pembahasan
            key={subtest}
            title={`Jawaban ${subtestTitles[subtest] || subtest}`}
            subtest={subtest}
            qnaData={qna}
          />
        ))}
      </div>
    </Container>
  )
}

interface StatisticProps {
  userScores: TryoutResultProps['userScores']
  userAnswers: TryoutResultProps['userAnswers']
  totalRank?: number
}

const Statistic = ({ userScores, userAnswers, totalRank }: StatisticProps) => {
  const totalSkorSemua = userScores.reduce((sum, score) => sum + score.score, 0)
  const totalSkor = totalSkorSemua / userScores.length

  // Create statistics data
  const statisticsData = userScores.map(score => {
    const subtestAnswers = userAnswers.filter(answer => answer.subtest === score.subtest)
    return {
      subtest: score.subtest,
      jml_benar: subtestAnswers.filter(answer => answer.is_correct).length,
      skor: score.score
    }
  })

// In your component
  return (
    <div className='grid w-full grid-cols-1 gap-6 xl:grid-cols-4'>
      <div className='col-span-3 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:col-span-1 xl:grid-cols-1'>
        <ResultTable title='Hasil'>
          <div className='grid grid-cols-2 gap-2.5 *:text-center'>
            <div className='rounded-lg bg-white'>
              <div className='px-auto pt-1 pb-1 font-medium text-black'>
                <p className='text-primary-900 text-[3rem] font-bold sm:text-[4rem]'>
                  {totalSkor.toFixed(1)}
                </p>
                Total Skor
              </div>
            </div>
            <div className='rounded-lg bg-white'>
              <div className='px-auto pt-1 pb-1 font-medium text-black'>
                <p className='text-primary-900 text-[3rem] font-bold sm:text-[4rem]'>
                  {totalRank ? totalRank.toFixed(1) : 'N/A'}
                </p>
                Peringkat
              </div>
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
      <StatisticTable data={statisticsData} className='col-span-3 px-6' />
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
          <span className='text-neutral-500'>Subtest: {subtestTitles[props.subtest] || props.subtest}</span>
        )}
      </header>

      {/* content goes here */}
      <div className='mb-2 h-full text-sm font-bold text-white md:text-base'>
        {props.children}
      </div>
    </main>
  )
}


interface PembahasanProps {
  title?: string
  className?: string
  subtest?: string
  qnaData: Array<{
    no: number
    jawaban: string
    pembahasan: string
    isCorrect: boolean
  }>
}

const Pembahasan = ({ title, className, subtest, qnaData }: PembahasanProps) => (
  <StyledCard title={title} className={className} subtest={subtest}>
    <ScrollArea className='h-full w-full overflow-hidden rounded-lg border border-neutral-200'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-nowrap'>No.</TableHead>
            <TableHead>Jawaban kamu</TableHead>
            <TableHead className='text-center'>Pembahasan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qnaData.map((data, index) => (
            <TableRow key={index}>
              <TableCell className='text-center font-medium'>{data.no}</TableCell>
              <TableCell className={cn('w-full text-left', data.isCorrect ? 'text-green-600' : 'text-red-600')}>
                {data.jawaban}
              </TableCell>
              <TableCell className='w-24 text-center'>
                <PembahasanButton data={data} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  </StyledCard>
)

interface LatexRendererProps {
  content: string;
}

const LatexRenderer = ({ content }: LatexRendererProps) => {
  // Check if content actually contains LaTeX
  const hasLatex = /\$|\\\(|\\\)|\\\[|\\\]|\\begin\{|\\end\{/.test(content);
  
  if (!hasLatex) {
    // If no LaTeX detected, just render as plain text with proper line breaks
    return (
      <div className="w-full">
        <div className="px-4 py-2 border border-neutral-200 rounded-md whitespace-pre-wrap">
          {content}
        </div>
      </div>
    );
  }

  // For LaTeX content, preprocess to fix common issues
  try {
    // Wrap standalone equations in display mode with appropriate delimiters
    const formattedContent = content
    .replace(/[“”]/g, '"') // Fix curly quotes
    .replace(/\\\\/g, '\\') // Remove redundant escape backslashes
    .replace(/\\\s*\\\s*/g, '\\\\ ') // Ensure valid LaTeX line breaks
    .replace(/\\\[/g, '\\begin{align*}') // Convert `\[ ... \]` to `align*`
    .replace(/\\\]/g, '\\end{align*}');
    
    // Render to KaTeX
    const html = katex.renderToString(formattedContent, {
      throwOnError: false,
      displayMode: true,
      output: 'html',
      trust: true,
      strict: false
    });

    return (
      <div className="w-full my-2">
        <div 
          className="px-4 py-3 border border-neutral-200 rounded-md overflow-x-auto"
          style={{ 
            maxWidth: '100%',
            overflowY: 'hidden',
            scrollbarWidth: 'thin'
          }}
        >
          <div 
            className="katex-container" 
            style={{ display: 'inline-block', maxWidth: '100%' }}
            dangerouslySetInnerHTML={{ __html: html }} 
          />
        </div>
      </div>
    );
  } catch (error) {
    // Fallback in case LaTeX rendering fails
    console.error("LaTeX rendering error:", error);
    return (
      <div className="w-full my-2">
        <div className="px-4 py-2 border border-neutral-200 rounded-md text-red-500 whitespace-pre-wrap">
          {content}
          <div className="text-xs mt-2 text-gray-500">
            (LaTeX rendering failed - check syntax)
          </div>
        </div>
      </div>
    );
  }
}

const PembahasanButton = ({ data }: { data: any }) => {
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
          {/* Using div with same styling as AlertDialogDescription to avoid nesting div in p */}
          <div className="text-black font-light text-sm dark:text-neutral-400 whitespace-pre-wrap">
            <LatexRenderer content={data.pembahasan} />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Kembali</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface StatisticTableProps {
  data: Array<{
    subtest: string
    jml_benar: number
    skor: number
  }>
  className?: string
}

const StatisticTable = ({ data, className }: StatisticTableProps) => {
  const leftData = data.slice(0, 4)
  const rightData = data.slice(4)
  const totalBenar = data.reduce((sum, item) => sum + item.jml_benar, 0)
  const totalSkorSemua = data.reduce((sum, item) => sum + item.skor, 0)
  const totalSkor = totalSkorSemua / data.length
  return (
    <StyledCard title='Statistik Nilai' className={className}>
      <div className='flex flex-col gap-5 lg:flex-row lg:gap-9'>
        <ScrollArea className='h-full w-full overflow-hidden rounded-lg border border-neutral-200'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subtest</TableHead>
                <TableHead>Benar</TableHead>
                <TableHead>Skor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leftData.map((data) => (
                <TableRow key={data.subtest}>
                  <TableCell className='font-medium'>{subtestTitles[data.subtest] || data.subtest}</TableCell>
                  <TableCell className='text-center'>{data.jml_benar}</TableCell>
                  <TableCell className='text-center'>{data.skor.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <ScrollArea className='h-full w-full overflow-hidden rounded-xl border border-neutral-200'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subtest</TableHead>
                <TableHead>Benar</TableHead>
                <TableHead>Skor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rightData.map((data) => (
                <TableRow key={data.subtest}>
                  <TableCell className='font-medium'>{subtestTitles[data.subtest] || data.subtest}</TableCell>
                  <TableCell className='text-center'>{data.jml_benar}</TableCell>
                  <TableCell className='text-center'>{data.skor.toFixed(1)}</TableCell>
                </TableRow>
              ))}
              <TableRow className='bg-gray-100 font-bold'>
                <TableCell className='text-center'>Total</TableCell>
                <TableCell className='text-center'>{totalBenar}</TableCell>
                <TableCell className='text-center'>{totalSkor.toFixed(1)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </StyledCard>
  )
}

// Keep existing PembahasanButton implementation

export default TryoutResult;