'use client'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
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

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

const ForgotPasswordForm = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [variant, setVariant] = useState<'success' | 'error' | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/user/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`${data.error}`);
        setVariant('error');
        return;
      }
      console.log('Success:', data);
      setMessage(`${data}`);
      setVariant('success');
    } catch (error: any) {
      console.error('Error:', error);
      setMessage(`${error.message}`);
      setVariant('error');
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

        <Button type='submit' variant={`tertiary`} className='mt-8 w-full max-w-xs self-center'>
          Kirim Email
        </Button>
        {message && (
          <p style={{ color: variant === 'success' ? 'green' : 'red' }}>
            {message}
          </p>
        )}
      </form>
    </Form>
  )
}

export default ForgotPasswordForm