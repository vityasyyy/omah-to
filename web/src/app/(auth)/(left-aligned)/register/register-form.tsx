'use client'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'

const formSchema = z
  .object({
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    nama_user: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirm_password: z.string().min(8),
    asal_sekolah: z.string().min(3, {
      message: 'Asal Sekolah must be at least 3 characters.',
    }),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirm_password'],
      })
    }
  })

const RegisterForm = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      nama_user: '',
      password: '',
      confirm_password: '',
      asal_sekolah: '',
    },
  })

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/user/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(values),
        }
      )

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`)
      }
      router.push('/login')
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
          name='nama_user'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder='Tuliskan Nama Lengkap' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='asal_sekolah'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asal Sekolah</FormLabel>
              <FormControl>
                <Input placeholder='Tuliskan Asal Sekolah' {...field} />
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
                <Input
                  type='password'
                  placeholder='Tuliskan Password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirm_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Tuliskan Ulang Password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          variant={`tertiary`}
          className='mt-8 w-full max-w-xs self-center'
        >
          Daftar
        </Button>
      </form>
    </Form>
  )
}

export default RegisterForm
