import { ArrowLeft, X } from 'lucide-react'
import BackLink from '../back-link'
import { Button } from '../ui/button'
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

type TopBarProps = {
  variant?: 'default' | 'ghost'
}

const TopBar = ({ variant = 'default' }: TopBarProps) => {
  return (
    <main className='flex flex-row justify-between gap-8'>
      <BackLink>
        <Button variant={variant === 'ghost' ? 'ghost' : 'card'} className={variant === 'ghost' ? 'text-white' : ''}>
          <ArrowLeft className='h-4 w-4' />
          Kembali
        </Button>
      </BackLink>

      <LogOutButton variant={variant} />
    </main>
  )
}

type LogOutButtonProps = {
  variant?: 'default' | 'ghost'
}

const LogOutButton = ({ variant = 'default' }: LogOutButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant === 'ghost' ? 'destructiveGhost' : 'destructive'}>
          Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah anda yakin?
            <AlertDialogCancel
              asChild
              className='my-auto h-auto border-none p-1'
            >
              <X className='text-neutral-500' />
            </AlertDialogCancel>
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild className='text-error-600'>
            <Button variant={'destructive'}>
              Logout
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TopBar
