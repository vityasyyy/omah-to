'use client'

import StyledCard from '@/components/tryout/styled-card'
import AnswerCard from '@/modules/tryout/answer-card'
import { useTryoutData } from '../tryout-context'
import { use } from 'react'

const TryoutPage = ({ params }: {
  params: Promise< { id: number } >
}) => {
  const { id } = use(params) 
  const soal = useTryoutData()
  const currentSoal = soal[id - 1]
  if (!currentSoal) return <p>Loading...</p> // Prevent errors if soal is not ready

  // Determine variant dynamically
  let variant: 'multiple_choice' | 'true_false' | 'uraian' = 'multiple_choice'
  if (currentSoal.true_false) variant = 'true_false'
  if (currentSoal.uraian) variant = 'uraian'

  return (
    <main className='grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3'>
      {/* Question Section */}
      <StyledCard title='Soal' className='md:col-span-2'>
        {currentSoal.text_soal}
      </StyledCard>

      {/* Pass only the current question */}
      <AnswerCard variant={variant} soal={[currentSoal]} soalSemua={soal}/>
    </main>
  );
}

export default TryoutPage;
