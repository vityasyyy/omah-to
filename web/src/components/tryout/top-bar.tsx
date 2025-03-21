'use client'
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
import { ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import LogOutDialog from '../log-out-dialog'

type TopBarProps = {
  variant?: 'default' | 'ghost'
}

const TopBar = ({ variant = 'default' }: TopBarProps) => {
  return (
    <main className='flex flex-row justify-between gap-8'>
      <Link href={variant === 'default' ? '/' : '/tryout'}>
        <Button
          variant={variant === 'ghost' ? 'ghost' : 'card'}
          className={`hover:cursor-pointer ${variant === 'ghost' ? 'text-white' : ''}`}
        >
          <ArrowLeft className='h-4 w-4' />
          Kembali
        </Button>
      </Link>

      <LogOutButton variant={variant} />
    </main>
  )
}

type LogOutButtonProps = {
  variant?: 'default' | 'ghost'
}

const LogOutButton = ({ variant = 'default' }: LogOutButtonProps) => {
  return (
    <LogOutDialog>
      <Button
        variant={variant === 'ghost' ? 'destructiveGhost' : 'destructive'}
      >
        Logout
      </Button>
    </LogOutDialog>
  )
}

export default TopBar
