import React from 'react'
import { getMbAttempt } from '@/lib/fetch/mb-fetch'
import ResultClient from './ResultClient'
import { cookies } from 'next/headers'
import Image from 'next/image'
import BackButton from '@/modules/career-match-up/back-button'
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
      <div className='mx-auto w-full pb-16'>
        <div className='px-4 py-5'>
          <BackButton />
        </div>
        <div className='px-4'>
          <div className='mb-8 flex flex-col p-4 gap-6'>
            <div className='flex flex-col items-center lg:flex-row'>
              <div className='relative mb-6'>
                <div className='absolute -inset-4 rounded-full bg-blue-100 opacity-70'></div>
                <Image
                  src={`/assets/divisions/${dominantCareer}.webp`}
                  alt='Career Icon'
                  width={100}
                  height={100}
                  className='relative z-10 w-[540px] lg:w-[968px]'
                />
              </div>
              <div className='px-10 flex flex-col'>
                <h1 className='mb-2 text-center lg:text-justify lg:text-2xl text-lg'>
                  Karier yang sesuai untukmu adalah
                </h1>
                <h2 className='mb-4 text-center lg:text-justify text-2xl font-bold text-blue-600'>
                  {results.dominantCareerTitle}
                </h2>

                {/* Description with better readability for mobile */}
                <div className='text-sm lg:text-base leading-relaxed text-gray-700'>
                  <p className='mb-4'>{results.fullDescription}</p>
                  <p>
                    Bayangkan kalau aplikasi favoritmu tampilannya berantakan,
                    susah dinavigasi, atau tombolnya tidak responsif! Itulah
                    kenapa masalah UI/UX sangat penting! Desain yang baik bisa
                    meningkatkan kepuasan pengguna, membuat orang-orang lebih
                    lama menggunakan aplikasi, dan bahkan membantu bisnis
                    berkembang. Kalau kamu suka desain, tertarik dengan perilaku
                    manusia, dan ingin menciptakan pengalaman digital yang lebih
                    baik, UI/UX bisa jadi jalur karier yang seru buatmu! Di era
                    digital ini, peran UI/UX semakin dibutuhkan untuk
                    menciptakan produk yang lebih manusiawi dan menarik.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
                       {' '}
            <Enthusiasts
              dominantCareer={
                dominantCareer.toUpperCase()
              }
            />
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
