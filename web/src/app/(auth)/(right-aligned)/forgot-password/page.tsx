import Link from "next/link"
import ForgotPasswordForm from "./forgot-password-form"

const ForgotPasswordPage = () => {
  return (
    <>
      <h1 className='text-2xl font-bold md:mb-6 md:text-4xl'>
        Lupa Password
      </h1>
      <ForgotPasswordForm />
      <p className='text-xs font-bold'>
        Sudah ganti password?{' '}
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

export default ForgotPasswordPage
