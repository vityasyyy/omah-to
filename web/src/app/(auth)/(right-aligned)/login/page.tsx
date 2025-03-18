
import LoginForm from './login-form'
import Link from 'next/link'

const LoginPage = () => {
  return (
    <>
      <h1 className='text-2xl font-bold md:mb-6 md:text-4xl'>
        Selamat Datang Kembali!
      </h1>
      <LoginForm />
      <p className='text-xs font-bold'>
        Belum punya akun?{' '}
        <Link
          href={`/register`}
          className='font-light underline underline-offset-2'
        >
          Daftar
        </Link>
      </p>
    </>
  )
}

export default LoginPage
