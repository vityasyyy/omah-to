import { ArrowLeft } from 'lucide-react'
import BackLink from '../back-link'
import { Button } from '../ui/button'

const TopBar = () => {
  return (
    <main className='flex flex-row justify-between gap-8'>
      <BackLink>
        <Button variant={`ghost`}>
          <ArrowLeft className='h-4 w-4' />
          Kembali
        </Button>
      </BackLink>

      <Button variant={`destructive`}>Logout</Button>
    </main>
  )
}

export default TopBar
