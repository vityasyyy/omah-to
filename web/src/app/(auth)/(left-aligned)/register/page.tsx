import Link from 'next/link'
import RegisterForm from './register-form'

const RegisterPage = () => {
  return (
    <>
      <h1 className='text-2xl font-bold md:mb-6 md:text-4xl'>
        Mulai Perjalananmu Sekarang!
      </h1>
      <RegisterForm />
      <p className='text-xs font-bold'>
        Sudah punya akun?{' '}
        <Link
          href={`/login`}
          className='font-light underline underline-offset-2'
        >
          Login
        </Link>
      </p>
    </>
  )
}

export default RegisterPage
