'use client'
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z
	.object({
		password: z.string().min(6, 'Password must be at least 6 characters.'),
		confirm: z.string().min(6, 'Confirm password must be at least 6 characters.'),
	})
	.refine((data) => data.password === data.confirm, {
		message: "Passwords don't match",
		path: ['confirm'],
	})

const ResetPasswordPage = () => {
	const router = useRouter()
	const { token } = useParams()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { password: '', confirm: '' },
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/user/reset-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					reset_token: token,
					new_password: values.password,
				}),
			})
            if (!res.ok) {
                console.error('Failed to reset password')
            }
			router.push('/login') // redirect after success
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<div className="flex justify-center items-center min-h-screen">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="New Password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirm"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm New Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="Confirm Password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" variant="default">
						Reset Password
					</Button>
				</form>
			</Form>
		</div>
	)
}

export default ResetPasswordPage
