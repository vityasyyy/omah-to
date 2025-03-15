'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

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

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
})

const LoginForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/user/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Required to send cookies for authentication
          body: JSON.stringify(values),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }
      router.push('/')
      // Redirect or handle successful login here
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleLogin)}
        className='flex w-full max-w-lg flex-col gap-4 text-left'
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
                    tabIndex={-1}
                    className='absolute top-1/2 right-3 -translate-y-1/2'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <Link
                href={`/forgot-password`}
                className='text-xs font-medium underline underline-offset-2'
              >
                Lupa Password
              </Link>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' variant={`tertiary`} className='mt-8 w-full max-w-xs self-center'>
          Masuk
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
