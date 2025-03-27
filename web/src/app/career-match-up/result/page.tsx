/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = 'force-dynamic'

import React from 'react'
import { getMbAttempt } from '@/lib/fetch/mb-fetch'
import ResultClient from './ResultClient'
import { cookies } from 'next/headers'
import Enthusiasts from '@/modules/career-match-up/enthusiasts'
import { DIVISIONS } from '@/lib/helpers/divisions'
import Container from '@/components/container'
import Image from 'next/image'

export default async function CareerMatchUpResult() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const attemptData = await getMbAttempt(accessToken, false)

    if (!attemptData) {
      return (
        <div className='flex min-h-screen flex-col items-center justify-center p-4'>
          <div className='max-w-lg text-center'>
            <h2 className='mb-4 text-2xl font-bold'>Belum ada hasil tes</h2>
            <p className='mb-6 text-gray-600'>
              Kamu belum menyelesaikan tes Career Match Up. Silakan ikuti tes
              terlebih dahulu untuk melihat hasil.
            </p>
            <ResultClient action='no-results' />
          </div>
        </div>
      )
    }

    // Extract the dominant career and find its information from DIVISIONS
    const dominantCareer = attemptData.bakat_user || ''
    const careerDivision = DIVISIONS.find(
      (div) => div.slug === dominantCareer.toLowerCase()
    )

    const results = {
      ...attemptData,
      dominantCareerTitle: careerDivision?.name || dominantCareer,
      shortDescription:
        careerDivision?.career.description ||
        `You show great potential in the ${dominantCareer} field.`,
      fullDescription:
        careerDivision?.career.fullDescription ||
        `Continue exploring opportunities in this area to develop your skills further.`,
    }

    return (
      <Container>
        <div className='flex flex-col items-center justify-center gap-8 lg:flex-row'>
          <div className='h-auto w-full lg:w-[4320px] items-center justify-center overflow-hidden rounded-lg md:w-[600px]'>
            <Image
              src={`/assets/divisions/${dominantCareer || 'dsai'}.webp`}
              alt=''
              width={1080}
              height={1080}
              className='h-auto w-full object-cover'
              priority // Tambahkan ini untuk memuat gambar lebih cepat
            />
          </div>
          <div className='text-center lg:text-left'>
            <h1 className='mb-6 text-3xl font-bold '>
              Your Career Match Result
            </h1>
            <h2 className='mb-4 text-2xl font-semibold'>
              Your dominant career path is:{' '}
              <span className='text-primary text-blue-600'>
                {results.dominantCareerTitle || results.dominantCareer}
              </span>
            </h2>
            <p className='mb-4'>{results.fullDescription}</p>
            <div className='mt-6'>
              <h3 className='mb-2 text-xl font-medium'>
                What this means for you:
              </h3>
              <p>{results.shortDescription}</p>
            </div>
            {results.careerScores && (
              <div className='mt-8'>
                <h3 className='mb-3 text-xl font-medium'>
                  Your Career Compatibility:
                </h3>
                <div className='space-y-3'>
                  {Object.entries(results.careerScores).map(
                    ([career, score]: [string, any]) => {
                      const divisionInfo = DIVISIONS.find(
                        (div) => div.slug === career.toLowerCase()
                      )
                      return (
                        <div key={career} className='flex items-center'>
                          <div className='w-1/3 font-medium'>
                            {divisionInfo?.name || career}:
                          </div>
                          <div className='w-2/3'>
                            <div className='h-4 w-full rounded-full bg-gray-200'>
                              <div
                                className='bg-primary h-4 rounded-full'
                                style={{ width: `${Math.round(score * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <Enthusiasts dominantCareer={dominantCareer.toUpperCase()} />
        </div>
      </Container>
    )
  } catch (error) {
    console.error('Error fetching results:', error)
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-4'>
        <div className='max-w-lg text-center'>
          <h2 className='mb-4 text-2xl font-bold text-red-500'>
            Tidak dapat memuat hasil saat ini
          </h2>
          <p className='mb-6 text-gray-600'>
            Maaf, terjadi kesalahan saat memuat hasil tes kamu. Silakan coba
            lagi nanti.
          </p>
          <ResultClient action='error' />
        </div>
      </div>
    )
  }
}
