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
    name: 'Alice',
    score: 90,
    rank: 1,
  },
  {
    id: 'INV002',
    name: 'Bob',
    score: 85,
    rank: 2,
  },
  {
    id: 'INV003',
    name: 'Charlie',
    score: 80,
    rank: 3,
  },
  {
    id: 'INV004',
    name: 'Diana',
    score: 75,
    rank: 4,
  },
  {
    id: 'INV005',
    name: 'Ethan',
    score: 70,
    rank: 5,
  },
]

const HistoryCard = () => {
  return (
    <StyledCard title='Ranking'>
      <ScrollArea className='h-[300px] w-full overflow-hidden rounded-xl border border-neutral-200'>
        <Table>
          {DUMMY_DATA.length === 0 && (
            <TableCaption className='font-bold mt-12 text-black'>
              Belum ada peserta.
            </TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Rank</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className='text-right'>Skor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_DATA.map((data) => (
              <TableRow key={data.id}>
                <TableCell className='font-medium'>{data.rank}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell className='text-right'>{data.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </StyledCard>
  )
}

export default HistoryCard
