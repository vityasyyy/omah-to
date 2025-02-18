import BlurCard from '@/components/blur-card'
import Link from 'next/link'
import React from 'react'

function careerMatchUpPage() {
  return (
    <>
      <div className='flex min-h-[calc(100vh-theme(spacing.48))] flex-1 items-center justify-center'>
        <BlurCard>
          <div className='flex flex-col items-center gap-6 px-12 py-8'>
            <h1 className='!text-center text-2xl font-semibold text-white'>
              PERHATIAN!
            </h1>
            <ol className='list-decimal space-y-3 pl-6 !text-start text-white'>
              <li>
                Pilih Pernyataan yang paling mewakili kepribadianmu pada salah
                satu gambar yang tersedia.
              </li>
              <li>
                Tidak ada jawaban yang benar atau salah, maka jawablah dengan
                objektif.
              </li>
              <li>Bila sudah siap tap tombol mulai tes dibawah ini:</li>
            </ol>
            <Link href={`/career-match-up/test`}>
              <button className='bg-primary-new-500 hover:bg-primary-new-300 mt-4 cursor-pointer rounded-lg px-6 py-3 text-white transition-colors'>
                Mulai Tes Kecocokan Karir
              </button>
            </Link>
          </div>
        </BlurCard>
      </div>
    </>
  )
}

export default careerMatchUpPage
