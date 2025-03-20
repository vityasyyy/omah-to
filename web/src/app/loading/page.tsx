'use client'
import { useEffect, useState } from 'react'

const TryoutTestLoading = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className='bg-transparent flex flex-col justify-center items-center h-screen'>
      <div className='relative mb-8 h-80 w-full max-w-md *:text-3xl'>
        {/* Floating elements */}
        <div
          className='animate-float-slow absolute top-10 left-10 h-20 w-16 rounded-md bg-blue-200 shadow-md'
          style={{ animationDelay: '0s' }}
        >
          <div className='flex h-full w-full items-center justify-center'>
            📝
          </div>
        </div>
        <div
          className='animate-float-medium absolute top-20 right-20 h-18 w-14 rounded-md bg-green-200 shadow-md'
          style={{ animationDelay: '0.5s' }}
        >
          <div className='flex h-full w-full items-center justify-center'>
            📊
          </div>
        </div>
        <div
          className='animate-float-fast absolute bottom-10 left-1/4 h-22 w-18 rounded-md bg-purple-200 shadow-md'
          style={{ animationDelay: '1s' }}
        >
          <div className='flex h-full w-full items-center justify-center'>
            🧠
          </div>
        </div>
        <div
          className='animate-float-medium absolute right-1/4 bottom-20 h-20 w-16 rounded-md bg-yellow-200 shadow-md'
          style={{ animationDelay: '1.5s' }}
        >
          <div className='flex h-full w-full items-center justify-center'>
            📚
          </div>
        </div>

        {/* Pulsing circle in the center */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
          <div className='bg-opacity-20 flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-blue-500'>
            <div className='bg-opacity-40 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-blue-500'>
              <div className='h-8 w-8 rounded-full bg-blue-500'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className='mb-2 h-2.5 w-full max-w-md rounded-full bg-gray-200'>
        <div
          className='h-2.5 rounded-full bg-blue-600 transition-all duration-100 ease-out'
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className='animate-pulse font-medium text-gray-600'>
        Preparing your test experience...
      </p>

      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(8deg);
          }
        }
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}

export default TryoutTestLoading
