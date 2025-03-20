/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { LeaderboardResponse } from '@/lib/types/types'

const HistoryCard = async ({
  leaderboard,
}: {
  leaderboard: LeaderboardResponse
}) => {
  const hasData = leaderboard?.data && leaderboard?.data?.length > 0
  return (
    <StyledCard title='Ranking'>
      <ScrollArea className='h-[300px] w-full overflow-hidden rounded-xl border border-neutral-200'>
        <Table>
          {/* Error fetching */}
          {leaderboard === null && (
            <TableCaption className='mt-12 font-bold text-black'>
              Error fetching leaderboard, please try again.
            </TableCaption>
          )}

          {/* No participants */}
          {!hasData && leaderboard !== null && (
            <TableCaption className='mt-12 font-bold text-black'>
              Belum ada peserta.
            </TableCaption>
          )}

          {/* Leaderboard Table */}
          {hasData && (
            <>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>Rank</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className='text-right'>Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard?.data.map((data: any, i: number) => (
                  <TableRow key={data.user_id}>
                    <TableCell className='font-medium'>{i + 1}</TableCell>
                    <TableCell>{data.username}</TableCell>
                    <TableCell className='text-right'>
                      {data.tryout_score.toFixed(2)}
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

export default HistoryCard
