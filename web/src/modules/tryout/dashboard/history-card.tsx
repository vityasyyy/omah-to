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

const DUMMY_DATA = [
  {
    id: 'INV001',
    date: '2021-08-01',
    score: 90,
    ranking: 1,
  },
  {
    id: 'INV002',
    date: '2021-08-02',
    score: 85,
    ranking: 2,
  },
  {
    id: 'INV003',
    date: '2021-08-03',
    score: 80,
    ranking: 3,
  },
  {
    id: 'INV004',
    date: '2021-08-04',
    score: 75,
    ranking: 4,
  },
  {
    id: 'INV005',
    date: '2021-08-05',
    score: 70,
    ranking: 5,
  },
]

const HistoryCard = () => {
  return (
    <StyledCard title='History'>
      <ScrollArea className='h-[300px] w-full overflow-hidden rounded-xl border border-neutral-200'>
        <Table>
          {DUMMY_DATA.length === 0 && (
            <TableCaption className='mt-12 text-lg font-bold text-black'>
              Kamu belum melakukan tes.
            </TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>No</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Skor</TableHead>
              <TableHead className='text-right'>Ranking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_DATA.map((data) => (
              <TableRow key={data.id}>
                <TableCell className='font-medium'>{data.id}</TableCell>
                <TableCell>{data.date}</TableCell>
                <TableCell>{data.score}</TableCell>
                <TableCell className='text-right'>{data.ranking}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </StyledCard>
  )
}

export default HistoryCard
