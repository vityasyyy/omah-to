'use client'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { User } from '@/lib/types/types'
import { LogOut } from 'lucide-react'

const ProfileButton = ({ user }: { user?: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger tabIndex={-1}>
        <div className='relative size-8 overflow-clip rounded-full bg-neutral-200'>
          <Image
            src={`/avatar.webp`}
            alt='Profile Picture'
            fill
            sizes='20%'
            className='object-cover'
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='-translate-x-8'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {}}
          className='text-error-400 hover:text-error-400!'
        >
          <LogOut className='text-error-400' /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileButton
