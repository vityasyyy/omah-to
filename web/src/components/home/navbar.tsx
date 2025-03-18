import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { fetchUser } from '@/lib/auth/fetch_user'
import { cn } from '@/lib/utils'
import { LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import Container from '../container'
import { Button, buttonVariants } from '../ui/button'
import Logo from './logo'
import NavbarResolver from './navbar-resolver'
import Image from 'next/image'
import { User } from '@/lib/types/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { cookies } from 'next/headers'

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

const Navbar = async () => {
  const user = await fetchUser()
  const cookieStore = await cookies()
  const foo = cookieStore.getAll()
  const isSignedIn = user !== null

  return (
    <>
      <main className='border-primary-100 fixed inset-x-0 top-0 z-50 border-b-2 bg-white/60 backdrop-blur-md'>
        <Container className='h-20 flex-row items-center justify-between gap-8'>
          <Logo />
          {JSON.stringify(user)}
          {JSON.stringify(foo)}

          <DesktopNavigation signedIn={isSignedIn} />
          <MobileNavigation />
        </Container>
      </main>

      <NavbarResolver />
    </>
  )
}

const DesktopNavigation = ({ signedIn = false }: { signedIn: boolean }) => (
  <main className='hidden gap-8 md:flex'>
    {NAV_ITEMS.map((nav, i) => (
      <Link href={nav.href} key={i}>
        <Button variant={`link`} className='px-0 font-normal'>
          {nav.name}
        </Button>
      </Link>
    ))}

    {signedIn ? (
      <></>
    ) : (
      <Link href={`/register`}>
        <Button variant={`tertiary`} className='px-8 hover:cursor-pointer'>
          Daftar Sekarang
        </Button>
      </Link>
    )}
  </main>
)

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
        <main className='flex h-full w-full flex-col justify-between gap-8 text-lg font-semibold text-black'>
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
                href={`/register`}
                className={buttonVariants({ variant: 'tertiary' })}
              >
                Daftar
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href={'/login'}
                className={cn(
                  buttonVariants({ variant: 'blur' }),
                  'text-primary-700 shadow-none'
                )}
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

const ProfileButton = (props: User) => {
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
          onClick={() => {}}
          className='text-error-400 hover:text-error-400!'
        >
          <LogOut className='text-error-400' /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Navbar
