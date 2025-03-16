'use client'

import StyledCard from '@/components/tryout/styled-card'
import AnswerCard from '@/modules/tryout/answer-card'
import { useTryoutData } from '../tryout-context'
import { use } from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css' // Import KaTeX styles

// Check if the text contains LaTeX markers ($ or \)
const isLatex = (text: string) => text.includes('$') || text.includes('\\');

const TryoutPage = ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = use(params);
  const { value: soal, time, currentSubtest } = useTryoutData();
  const currentSoal = soal[id - 1];

  if (!currentSoal) return <p>Loading...</p>; // Prevent errors if soal is not ready

  // Determine question type
  let variant: 'multiple_choice' | 'true_false' | 'uraian' = 'multiple_choice';
  if (currentSoal.true_false) variant = 'true_false';
  if (currentSoal.uraian) variant = 'uraian';

  return (
    <main className='grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3'>
      {/* Question Section */}
      <StyledCard title='Soal' className='md:col-span-2'>
        {isLatex(currentSoal.text_soal) ? (
          <BlockMath math={currentSoal.text_soal} />
        ) : (
          <p>{currentSoal.text_soal}</p>
        )}
      </StyledCard>

      {/* Answer Section */}
      <AnswerCard
        time={time}
        variant={variant}
        soal={[currentSoal]}
        soalSemua={soal}
        currentSubtest={currentSubtest}
      />
    </main>
  );
};

export default TryoutPage;
