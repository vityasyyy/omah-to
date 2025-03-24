/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { getMbAttempt } from '@/lib/fetch/mb-fetch'
import ResultClient from './ResultClient'
import { cookies } from 'next/headers'
import Enthusiasts from '@/modules/career-match-up/enthusiasts'

// Career path descriptions mapping
const careerDescriptions: Record<
  string,
  { title: string; description: string; fullDescription: string }
> = {
  frontend: {
    title: 'Front-End Development',
    description: 'You show strong aptitude for Front-End Development.',
    fullDescription:
      'This field focuses on creating intuitive and responsive user interfaces for websites and applications. Your creativity combined with technical skills could help you build engaging digital experiences that users love to interact with.',
  },
  backend: {
    title: 'Back-End Development',
    description:
      'Your results indicate you would excel in Back-End Development.',
    fullDescription:
      'This role focuses on server-side logic, databases, and application architecture. Your analytical thinking and problem-solving abilities would be valuable in building robust systems that power modern applications.',
  },
  mobapps: {
    title: 'Mobile App Development',
    description: 'You demonstrate natural talent for Mobile App Development.',
    fullDescription:
      "This specialization involves creating applications for smartphones and tablets. Your attention to detail and user-focused mindset could help you build mobile solutions that improve people's daily lives.",
  },
  uiux: {
    title: 'UI/UX Design',
    description: 'Your results suggest you have a strong eye for UI/UX Design.',
    fullDescription:
      'Pernah nggak sih kamu pakai aplikasi atau website yang bikin betah karena tampilannya menarik dan fungsionalitasnya nyaman? Itulah sebabnya bahwa jadi UI/UX Designer! UI (User Interface) berfokus pada bagaimana sebuah aplikasi atau website terlihat: mulai dari warna, ikon, font, hingga tata letak. Sementara itu, UX (User Experience) memastikan pengalaman pengguna tetap nyaman, mudah, dan intuitif, sehingga orang-orang nggak kebingungan saat menggunakannya.',
  },
  dsai: {
    title: 'Data Science & AI',
    description: 'You show great potential in Data Science & AI.',
    fullDescription:
      'This cutting-edge field uses statistics, machine learning, and programming to extract insights from data and build intelligent systems. Your analytical skills and pattern recognition abilities would be valuable in solving complex problems using data-driven approaches.',
  },
  cysec: {
    title: 'Cyber Security',
    description: 'You demonstrate aptitude for Cyber Security.',
    fullDescription:
      'This critical field involves protecting digital systems and data from threats. Your analytical mindset and detail-oriented approach would be assets in identifying vulnerabilities and implementing robust security measures.',
  },
  gamedev: {
    title: 'Game Development',
    description: 'Your results indicate strong potential in Game Development.',
    fullDescription:
      'This creative field combines programming, art, and storytelling to create interactive entertainment experiences. Your imagination and technical skills could help you build immersive worlds that captivate players.',
  },
  cp: {
    title: 'Competitive Programming',
    description: 'You show exceptional talent for Competitive Programming.',
    fullDescription:
      'This field tests your ability to solve complex algorithmic problems efficiently. Your logical thinking and problem-solving skills would be valuable in competitions and in roles that require algorithmic optimization.',
  },
}

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

    // Extract the dominant career and add title and description
    const dominantCareer = attemptData.bakat_user || ''
    const careerInfo = careerDescriptions[dominantCareer.toLowerCase()] || {
      title: dominantCareer,
      description: `You show great potential in the ${dominantCareer} field.`,
      fullDescription: `Continue exploring opportunities in this area to develop your skills further.`,
    }

    const results = {
      ...attemptData,
      dominantCareerTitle: careerInfo.title,
      shortDescription: careerInfo.description,
      fullDescription: careerInfo.fullDescription,
    }

    return (
      <div className='p-8'>
        <h1 className='mb-6 text-3xl font-bold'>Your Career Match Result</h1>
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h2 className='mb-4 text-2xl font-semibold'>
            Your dominant career path is:{' '}
            <span className='text-primary'>
              {results.dominantCareerTitle || results.dominantCareer}
            </span>
          </h2>
          <p className='mb-4'>
            Based on your answers, we&apos;ve identified that you have a strong
            inclination towards careers in the{' '}
            {results.dominantCareerTitle || results.dominantCareer} field.
          </p>
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
                  ([career, score]: [string, any]) => (
                    <div key={career} className='flex items-center'>
                      <div className='w-1/3 font-medium'>
                        {careerDescriptions[career.toLowerCase()]?.title ||
                          career}
                        :
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
                )}
              </div>
            </div>
          )}
          <div>
            {' '}
            <Enthusiasts dominantCareer={dominantCareer.toUpperCase()} />       
             {' '}
          </div>
        </div>
      </div>
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
