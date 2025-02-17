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
      <main className='fixed inset-x-0 top-0 z-50 bg-white/60 backdrop-blur-md'>
        <Container className='flex-row items-center justify-between gap-8'>
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
            <h1 className='text-primary font-bold'>omah-to</h1>
          </Link>

          <DesktopNavigation />
          <MobileNavigation />
        </Container>
      </main>

      {/* navbar resolver kudus */}
      <Spacer />
    </>
  )
}

const DesktopNavigation = () => (
  <main className='hidden gap-8 md:flex'>
    {NAV_ITEMS.map((nav, i) => (
      <Link href={nav.href} key={i}>
        <Button variant={`link`} className='px-0 font-bold'>
          {nav.name}
        </Button>
      </Link>
    ))}

    <Link href={`/login`}>
      <Button variant={`default`} className='px-8 hover:cursor-pointer'>
        Login
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

const Spacer = () => <main className='h-16' />

export default Navbar
