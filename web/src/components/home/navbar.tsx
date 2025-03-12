'use client'
import Link from 'next/link'
import Container from '../container'
import { Button, buttonVariants } from '../ui/button'
import Image from 'next/image'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LogOut, Menu } from 'lucide-react'
import NavbarResolver from './navbar-resolver'
import { signOut, useSession } from 'next-auth/react'
import { Session } from 'next-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const NAV_ITEMS = [
  {
    name: 'CSTryOuts',
    href: '/tryout',
  },
  {
    name: 'Career Match Up',
    href: '/career-match-up',
  },
]

const Navbar = () => {
  return (
    <>
      <main className='fixed inset-x-0 top-0 z-50 border-b-2 border-neutral-200 bg-white/60 backdrop-blur-md'>
        <Container className='h-16 flex-row items-center justify-between gap-8'>
          <Link href={`/`} className='flex items-center gap-4'>
            <div className='relative aspect-square h-7'>
              <Image
                src='/placeholder.png'
                alt='logo'
                fill
                sizes='100%'
                className='object-cover'
              />
            </div>
            <h1 className='text-primary text-primary-700 font-bold'>omah-to</h1>
          </Link>

          <DesktopNavigation />
          <MobileNavigation />
        </Container>
      </main>

      <NavbarResolver />
    </>
  )
}

const DesktopNavigation = () => {
  const { data: session } = useSession()

  return (
    <main className='hidden items-center gap-8 md:flex'>
      {NAV_ITEMS.map((nav, i) => (
        <Link href={nav.href} key={i}>
          <Button variant={`link`} className='px-0 font-normal'>
            {nav.name}
          </Button>
        </Link>
      ))}

      {session ? (
        <ProfileButton session={session} />
      ) : (
        <Link href={`/login`}>
          <Button variant={`tertiary`} className='px-8 hover:cursor-pointer'>
            Login
          </Button>
        </Link>
      )}
    </main>
  )
}

const MobileNavigation = () => (
  <main className='flex md:hidden'>
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={`ghost`}>
          <Menu className='text-primary' />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col items-start justify-between pt-[15vh] pb-[10vh] *:text-start'>
        <SheetHeader>
          <SheetTitle className='sr-only'>Sidebar</SheetTitle>
          <SheetDescription className='sr-only'>
            Description for sidebar
          </SheetDescription>
        </SheetHeader>
        <main className='flex h-full w-full flex-col justify-between gap-8 text-lg font-bold text-black'>
          <section className='flex flex-col gap-2'>
            {NAV_ITEMS.map((nav, i) => (
              <Link key={i} href={nav.href}>
                <SheetClose>{nav.name}</SheetClose>
              </Link>
            ))}
          </section>
          <section className='flex flex-col gap-2'>
            <SheetClose asChild>
              <Link
                href={`/login`}
                className={buttonVariants({ variant: 'default' })}
              >
                Daftar
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href={'/signup'}
                className={buttonVariants({ variant: 'outline' })}
              >
                Masuk
              </Link>
            </SheetClose>
          </section>
        </main>
      </SheetContent>
    </Sheet>
  </main>
)

const ProfileButton = (props: { session: Session | null }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger tabIndex={-1}>
        <div className='relative size-8 overflow-clip rounded-full bg-neutral-200'>
          <Image
            src={`/avatar.jpg`}
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
          onClick={async () => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/validateprofile`,
              {
                credentials: 'include',
              }
            )

            if (res.ok) {
              console.log('success:', res)
            } else {
              console.log('error')
            }
          }}
        >
          Validate Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`})}
          className='text-error-400 hover:text-error-400!'
        >
          <LogOut className='text-error-400' /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Navbar
