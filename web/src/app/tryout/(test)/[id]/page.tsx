'use client'

import StyledCard from '@/components/tryout/styled-card'
import AnswerCard from '@/modules/tryout/answer-card'
import { useTryoutData } from '../tryout-context'
import { use } from 'react'
import Image from 'next/image'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css' // Import KaTeX styles

// Simplified function to render text with LaTeX
const renderWithKatex = (text: string) => {
  // If text includes backslashes, render with KaTeX
  if (text.includes('\\')) {
    return <BlockMath math={text} />;
  }
  // Otherwise render as plain text
  return <p>{text}</p>;
};

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
        {renderWithKatex(currentSoal.text_soal)}
      </StyledCard>

      {currentSoal.path_gambar_soal && (
        <Image 
          src={currentSoal.path_gambar_soal} 
          alt="Question Image" 
          width={500} 
          height={300} 
          className="rounded-lg"
        />
)}
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
