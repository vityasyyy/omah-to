'use client'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import LogOutDialog from '../log-out-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const ProfileButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger tabIndex={-1}>
        <div className='relative size-8 overflow-clip rounded-full bg-neutral-200'>
          <Image
            src={`/assets/profile/avatar.webp`}
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
        <LogOutDialog>
          <DropdownMenuItem
            className='text-error-400 hover:text-error-400!'
            onSelect={(e) => {
              e.preventDefault()
            }}
          >
            <LogOut className='text-error-400' /> Log Out
          </DropdownMenuItem>
        </LogOutDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileButton
