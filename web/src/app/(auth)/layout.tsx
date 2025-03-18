import { fetchUser } from '@/lib/auth/fetch_user'
import { redirect } from 'next/navigation'

const AuthLayout = async ({ children }: { children?: React.ReactNode }) => {
  const user = await fetchUser()
  if (user) redirect('/')

  return <main className='bg-primary-100 md:h-screen'>{children}</main>
}

export default AuthLayout
