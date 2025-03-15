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
import { Menu } from 'lucide-react'
import NavbarResolver from './navbar-resolver'
import Logo from './logo'
import { cn } from '@/lib/utils'

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
      <main className='fixed inset-x-0 top-0 bg-white/60 border-b-2 border-primary-100 backdrop-blur-md z-50'>
        <Container className='flex-row h-20 items-center justify-between gap-8'>
          <Logo />

          <DesktopNavigation />
          <MobileNavigation />
        </Container>
      </main>

      <NavbarResolver />
    </>
  )
}

const DesktopNavigation = () => (
  <main className='hidden gap-8 md:flex'>
    {NAV_ITEMS.map((nav, i) => (
      <Link href={nav.href} key={i}>
        <Button variant={`link`} className='px-0 font-normal'>
          {nav.name}
        </Button>
      </Link>
    ))}

    <Link href={`/register`}>
      <Button variant={`tertiary`} className='px-8 hover:cursor-pointer'>
        Daftar Sekarang
      </Button>
    </Link>
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
                className={cn(buttonVariants({ variant: 'blur' }), 'text-primary-700 shadow-none')}
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

export default Navbar
