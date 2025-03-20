import type { Metadata } from 'next'
import './globals.css'
import { lora, plusJakartaSans } from '@/lib/fonts'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'omah-to',
  description: 'by omahti',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${plusJakartaSans.className} ${lora.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
