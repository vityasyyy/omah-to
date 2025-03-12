import { lora, plusJakartaSans } from '@/lib/fonts'
import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import SessionProvider from '@/components/session-provider'

export const metadata: Metadata = {
  title: 'omah-to',
  description: 'by omahti',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()

  return (
    <html lang='en'>
      <body
        className={`${plusJakartaSans.className} ${lora.variable} antialiased`}
      >
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
