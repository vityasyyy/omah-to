/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import Image from 'next/image'
import { ArrowUpRight, X } from 'lucide-react'
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
import * as motion from 'motion/react-client'
import { SUBTESTS } from '@/lib/helpers/subtests'

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
  //
}

const TryoutResult = ({
  userScores,
  userAnswers,
  totalRank,
  // jumlah_peserta,
}: TryoutResultProps) => {
const jumlah_peserta = 100;

  // Group answers by subtest
  const groupedAnswers = userAnswers.reduce(
    (acc, answer) => {
      const key = answer.subtest
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push({
        no: acc[key].length + 1,
        jawaban: answer.text_pilihan || answer.user_answer,
        pembahasan: answer.pembahasan,
        isCorrect: answer.is_correct,
      })
      return acc
    },
    {} as Record<
      string,
      Array<{
        no: number
        jawaban: string
        pembahasan: string
        isCorrect: boolean
      }>
    >
  )

  return (
    <Container>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'tween', duration: 0.2 }}
        className='text-primary-900 mt-9 mb-4.5 text-center text-2xl font-bold md:mb-7'
      >
        Hasil TryOut
      </motion.h1>

      <motion.main
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'tween', duration: 0.2 }}
        className='flex flex-col gap-4'
      >
        <Statistic
          userScores={userScores}
          userAnswers={userAnswers}
          totalRank={totalRank}
          jumlah_peserta={jumlah_peserta}
        />
        <div className='space-y-6'>
          {Object.entries(groupedAnswers).map(([subtest, qna]) => (
            <Pembahasan
              key={subtest}
              title={`Jawaban`}
              subtest={SUBTESTS[subtest]?.title}
              qnaData={qna}
            />
          ))}
        </div>
      </motion.main>
    </Container>
  )
}

interface StatisticProps {
  userScores: TryoutResultProps['userScores']
  userAnswers: TryoutResultProps['userAnswers']
  totalRank?: number
  jumlah_peserta: number
}

const Statistic = ({ userScores, userAnswers, totalRank, jumlah_peserta }: StatisticProps) => {
  const totalSkorSemua = userScores.reduce((sum, score) => sum + score.score, 0)
  const totalSkor = totalSkorSemua / userScores.length

  // Create statistics data
  const statisticsData = userScores.map((score) => {
    const subtestAnswers = userAnswers.filter(
      (answer) => answer.subtest === score.subtest
    )
    return {
      subtest: score.subtest,
      jml_benar: subtestAnswers.filter((answer) => answer.is_correct).length,
      skor: score.score,
    }
  })

  // In your component
  return (
    <div className='grid w-full grid-cols-1 gap-6 xl:grid-cols-4'>
      <div className='col-span-3 grid w-full grid-cols-1 gap-4 md:grid-cols-1 xl:col-span-1'>
        <ResultTable title='Hasil'>
          <div className='grid grid-cols-2 gap-2.5 *:text-center'>
            <div className='rounded-lg bg-white'>
              <div className='px-auto pt-1 pb-1 font-medium text-black'>
                <p className='text-primary-900 text-[3rem] font-bold sm:text-[4rem]'>
                  {Math.round(totalSkor)}
                </p>
                <p className='text-xs mb-1'>/1000</p>
                <hr />
                <p className='font-bold text-xs mt-1'>Total Skor</p>
              </div>
            </div>
            <div className='rounded-lg bg-white'>
              <div className='px-auto pt-1 pb-1 font-medium text-black'>
                <p className='text-primary-900 text-[3rem] font-bold sm:text-[4rem]'>
                  {totalRank ? totalRank : 'N/A'}
                </p>
                <p className='text-xs mb-1'>{jumlah_peserta}</p>
                <hr />
                <p className='font-bold text-xs mt-1'>Peringkat</p>
              </div>
            </div>
          </div>
        </ResultTable>
        <section className='border-primary-500 bg-primary-900 relative h-48 rounded-xl border p-4 text-white *:text-left md:h-auto xl:h-48'>
          <p className='text-2xl font-bold sm:text-3xl 2xl:text-4xl'>
            Kamu
            <br className='xl:hidden' /> Keren!
          </p>
          <br className='hidden 2xl:block' />
          <p className='mr-52 text-sm font-light'>
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
          <span className='text-neutral-500'>
            Subtest: {SUBTESTS[props.subtest]?.title || props.subtest}
          </span>
        )}
      </header>

      {/* content goes here */}
      <div className='mb-2 h-fit text-sm font-bold text-white md:text-base'>
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

const Pembahasan = ({
  title,
  className,
  subtest,
  qnaData,
}: PembahasanProps) => (
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
              <TableCell className='text-center font-medium'>
                {data.no}
              </TableCell>
              <TableCell
                className={cn(
                  'w-full text-left',
                  data.isCorrect ? 'text-green-600' : 'text-red-600'
                )}
              >
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

const LatexRenderer = ({ content }: { content: string }) => {
  // Early return if the content is empty
  if (!content) {
    return null
  }

  // Properly normalize the LaTeX content from database
  const normalizeLatex = (latex: string) => {
    return latex
      .replace(/\\\\/g, '\\') // Convert \\ to \ for LaTeX commands
      .replace(/[""]/g, '"') // Fix curly quotes
  }

  // Function to render the content with LaTeX
  const renderWithLatex = () => {
    // Normalize content coming from the database
    const normalizedContent = normalizeLatex(content)

    // Step 1: Process block LaTeX expressions
    // Match block LaTeX surrounded by \[ \] or $$...$$
    const blockLatexRegex = /(\\\[([\s\S]*?)\\\]|\$\$([\s\S]*?)\$\$)/g
    let processedContent = normalizedContent
    const blockLatexMatches: string[] = []
    let blockMatch

    // Extract all block LaTeX and replace with placeholders
    while ((blockMatch = blockLatexRegex.exec(normalizedContent)) !== null) {
      const fullMatch = blockMatch[0]
      const latexContent = blockMatch[2] || blockMatch[3] // Get the content inside delimiters

      // Add to matches array and replace with placeholder
      blockLatexMatches.push(latexContent)
      processedContent = processedContent.replace(
        fullMatch,
        `[BLOCK_LATEX_${blockLatexMatches.length - 1}]`
      )
    }

    // Step 2: Process inline LaTeX expressions
    // Match inline LaTeX surrounded by \( \) or $...$
    const inlineLatexRegex = /(\\\(([\s\S]*?)\\\)|\$([\s\S]*?)\$)/g
    const inlineLatexMatches: string[] = []
    let inlineMatch

    // Extract all inline LaTeX and replace with placeholders
    while ((inlineMatch = inlineLatexRegex.exec(processedContent)) !== null) {
      const fullMatch = inlineMatch[0]
      const latexContent = inlineMatch[2] || inlineMatch[3] // Get the content inside delimiters

      // Add to matches array and replace with placeholder
      inlineLatexMatches.push(latexContent)
      processedContent = processedContent.replace(
        fullMatch,
        `[INLINE_LATEX_${inlineLatexMatches.length - 1}]`
      )
    }

    // Step 3: Render each piece and replace placeholders
    // Convert text parts and placeholders to JSX elements
    const parts = processedContent.split(
      /(\[BLOCK_LATEX_\d+\]|\[INLINE_LATEX_\d+\])/g
    )

    return parts.map((part, index) => {
      // Check if this part is a placeholder
      const blockMatch = part.match(/\[BLOCK_LATEX_(\d+)\]/)
      if (blockMatch) {
        const idx = parseInt(blockMatch[1])
        const formula = blockLatexMatches[idx]

        try {
          const html = katex.renderToString(formula, {
            throwOnError: false,
            displayMode: true,
            output: 'html',
          })

          return (
            <div
              key={`block-${index}`}
              // Reduce margin from my-2 (8px) to my-1 (4px)
              className='my-0 overflow-x-auto'
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )
        } catch (error) {
          console.error('Block LaTeX rendering error:', error)
          return (
            <div key={`block-${index}`} className='my-2 text-red-500'>
              {`$$${formula}$$`}
              <div className='mt-1 text-xs text-gray-500'>
                (LaTeX rendering failed)
              </div>
            </div>
          )
        }
      }

      const inlineMatch = part.match(/\[INLINE_LATEX_(\d+)\]/)
      if (inlineMatch) {
        const idx = parseInt(inlineMatch[1])
        const formula = inlineLatexMatches[idx]

        try {
          const html = katex.renderToString(formula, {
            throwOnError: false,
            displayMode: false,
            output: 'html',
          })

          return (
            <span
              key={`inline-${index}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )
        } catch (error) {
          console.error('Inline LaTeX rendering error:', error)
          return (
            <span key={`inline-${index}`} className='text-red-500'>
              {`$${formula}$`}
            </span>
          )
        }
      }

      // Regular text
      return part ? <span key={`text-${index}`}>{part}</span> : null
    })
  }

  return (
    <div className='w-full'>
      <div className='rounded-md border border-neutral-200 px-4 py-3 whitespace-pre-wrap'>
        {renderWithLatex()}
      </div>
    </div>
  )
}

const PembahasanButton = ({ data }: { data: any }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span>
          <Button
            variant='pembahasan'
            className='hidden self-center text-white md:block'
          >
            Lihat Pembahasan
          </Button>
          <Button
            variant='pembahasan'
            className='self-center text-white md:hidden'
          >
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
          <div className='text-sm font-light whitespace-pre-wrap text-black dark:text-neutral-400'>
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
                  <TableCell className='font-medium'>
                    {SUBTESTS[data.subtest]?.title || data.subtest}
                  </TableCell>
                  <TableCell className='text-center'>
                    {data.jml_benar}
                  </TableCell>
                  <TableCell className='text-center'>
                    {data.skor.toFixed(1)}
                  </TableCell>
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
                  <TableCell className='font-medium'>
                    {SUBTESTS[data.subtest]?.title}
                  </TableCell>
                  <TableCell className='text-center'>
                    {data.jml_benar}
                  </TableCell>
                  <TableCell className='text-center'>
                    {data.skor.toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className='bg-gray-100 font-bold'>
                <TableCell className='text-center'>Total</TableCell>
                <TableCell className='text-center'>{totalBenar}</TableCell>
                <TableCell className='text-center'>
                  {totalSkor.toFixed(1)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </StyledCard>
  )
}

// Keep existing PembahasanButton implementation

export default TryoutResult
