import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const AuthLayout = async ({ children }: { children?: React.ReactNode }) => {
  const cookieStore = await cookies()
  const isSignedIn = cookieStore.get('isSignedIn')
  if (isSignedIn) redirect('/')

  return <main className='bg-primary-100 md:h-screen'>{children}</main>
}

export default AuthLayout
