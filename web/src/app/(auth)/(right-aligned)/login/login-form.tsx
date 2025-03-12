'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
})

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setPending(true)
    signIn('credentials', {
      callbackUrl: '/',
      email: values.email,
      password: values.password,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleLogin)}
        className='flex w-full flex-col gap-4 text-left'
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='email@email.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Tuliskan Password'
                    {...field}
                  />
                  <button
                    type='button'
                    className='absolute top-1/2 right-3 -translate-y-1/2'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <Link
                href={`/forgot-password`}
                tabIndex={-1}
                className='text-xs font-medium underline underline-offset-2'
              >
                Lupa Password
              </Link>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={pending}
          className='mt-8 w-full max-w-xs self-center'
        >
          {pending ? (
            <>
              <LoaderCircle className='animate-spin' />
              Loading...
            </>
          ) : (
            'Masuk'
          )}
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
