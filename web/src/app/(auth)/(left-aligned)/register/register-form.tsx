
'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
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
  nama_user: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  asal_sekolah: z.string().min(3, {
    message: 'Asal Sekolah must be at least 3 characters.',
  }
  )
})

const RegisterForm = () => {
  const router = useRouter()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      nama_user: '',
      password: '',
      asal_sekolah: ''
    },
  })

  // 2. Define a submit handler.
  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Needed if your backend uses cookies for authentication
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }
      // buat toast pas udah berhasil, redirect ke halaman login sambil tunjukkin message "U can now login with your credentials"
      router.push('/login')
    } catch (error) {
      //kasih toast di form
      console.error("Login error:", error);
    }
};

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
                <Input placeholder='Tuliskan Password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='mt-8 w-full max-w-xs self-center'>
          Daftar
        </Button>
      </form>
    </Form>
  )
}

export default RegisterForm
