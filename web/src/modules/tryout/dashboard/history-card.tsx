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
import { SubtestScore, SubtestsScoreResponse } from '@/lib/types/types'

const HistoryCard = async ({ score }: { score: SubtestsScoreResponse }) => {
  const subtestsScore: SubtestsScoreResponse = score
  return (
    <StyledCard title='History'>
      <ScrollArea className='h-[300px] w-full overflow-hidden rounded-xl border border-neutral-200'>
        <Table>
          {subtestsScore === null && (
            <TableCaption className='mt-12 text-lg font-bold text-black'>
              Error fetching data, please try again.
            </TableCaption>
          )}
          {subtestsScore?.data === undefined && subtestsScore !== null && (
            <TableCaption className='mt-12 text-lg font-bold text-black'>
              Kamu belum melakukan tes.
            </TableCaption>
          )}
          {subtestsScore?.data && (
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
                    <TableCell>{data.subtest}</TableCell>
                    <TableCell>{data.score}</TableCell>
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

export default HistoryCard
