import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import { getMbAttempt } from '@/lib/fetch/mb-fetch'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

async function careerMatchUpPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const attempt = await getMbAttempt(accessToken, false)
  if (attempt) {
    redirect('/career-match-up/result')
  }

  return (
    <>
      <div className='flex min-h-[calc(100vh-theme(spacing.48))] flex-1 flex-col-reverse items-center justify-center gap-20 lg:flex-row'>
        <div className='flex justify-start'>
          <div className='xxl:left-36 absolute bottom-0 left-0 z-0 hidden sm:block'>
            <Image
              src='/assets/Robot-Tobk-1.webp'
              alt='Robot Mascot'
              width={526}
              height={526}
              className='z-0 w-[240px] drop-shadow-md md:w-[360px] lg:w-[480px]'
            />
          </div>
        </div>
        <Card className='xxl:max-w-3xl z-10 w-full max-w-xl bg-white shadow-lg lg:absolute lg:ml-96 xl:max-w-2xl'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center'>
              <div className='mr-2 rounded-full bg-blue-600 p-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <circle cx='12' cy='12' r='10'></circle>
                  <line x1='12' y1='8' x2='12' y2='12'></line>
                  <line x1='12' y1='16' x2='12.01' y2='16'></line>
                </svg>
              </div>
              <h2 className='text-xl font-bold'>Perhatian!</h2>
            </div>
            <hr />

            <ol className='my-6 list-decimal space-y-2 pl-5'>
              <li>
                Pilih jawaban yang paling mewakili kepalaaanmu pada salah satu
                gambar yang tersedia.
              </li>
              <li>
                Tidak ada jawaban yang benar atau salah, maka jawablah dengan
                objektif!
              </li>
              <li>
                Pastikan memilih dengan hati-hati, karena jawaban tidak bisa
                diubah setelah dipilih (tidak ada penyesalan).
              </li>
              <li>Bila sudah siap, tombol mulai tes dibawah ini.</li>
            </ol>

            <Link href={`/career-match-up/test`}>
              <Button className='w-full bg-blue-600 text-white hover:bg-blue-700'>
                Mulai Tes Kecocokan Karir
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default careerMatchUpPage
