import StyledCard from '@/components/tryout/styled-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SUBTESTS } from '@/lib/helpers/subtests'
import { SubtestScore, SubtestsScoreResponse } from '@/lib/types/types'

const HistoryCard = async ({ score }: { score: SubtestsScoreResponse }) => {
  const subtestsScore: SubtestsScoreResponse = score

  return (
    <StyledCard title='History'>
      <ScrollArea className='h-[300px] w-full overflow-hidden rounded-xl border border-neutral-200'>
        <Table>
          {subtestsScore?.data ? (
            <>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>No</TableHead>
                  <TableHead>Subtest</TableHead>
                  <TableHead>Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subtestsScore?.data.map((data: SubtestScore, i: number) => (
                  <TableRow
                    key={`${data.user_id}-${data.attempt_id}-${data.subtest}`}
                  >
                    <TableCell className='font-medium'>{i + 1}</TableCell>
                    <TableCell>{SUBTESTS[data.subtest].title}</TableCell>
                    <TableCell>{data.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <TableCaption className='mt-12 font-bold text-black'>
              Kamu belum melakukan tes.
            </TableCaption>
          )}
        </Table>
      </ScrollArea>
    </StyledCard>
  )
}

export default HistoryCard
