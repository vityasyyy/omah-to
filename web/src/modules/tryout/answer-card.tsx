'use client';

import StyledCard from '@/components/tryout/styled-card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { progressTryout, syncTryout } from '@/lib/fetch/tryout-test';

type Variant = 'multiple_choice' | 'true_false' | 'uraian';

interface AnswerCardProps {
  variant?: Variant;
  soal?: any;
  soalSemua: any[];
  time: Date;
}

interface AnswerPayload {
  kode_soal: string;
  jawaban: string | null;
}

interface LocalAnswer extends AnswerPayload {
  updatedAt: number;
  synced: boolean;
}

const AnswerCard = ({ variant = 'multiple_choice', soalSemua }: AnswerCardProps) => {
  const pathname = usePathname();
  const basePath = pathname.slice(0, pathname.lastIndexOf('/'));
  const currentNumber = Number(pathname.slice(pathname.lastIndexOf('/') + 1)) || 1;
  const localStorageKey = `tryout_answers_user`;

  // State management
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({});
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Derived values
  const totalQuestions = soalSemua.length;
  const clampedNumber = Math.min(Math.max(currentNumber, 1), totalQuestions);
  const currentSoal = soalSemua[clampedNumber - 1];
  const isLastQuestion = clampedNumber === totalQuestions;

  // Time limit handler
  useEffect(() => {
    if (!timeLimit) return;

    const checkTime = () => {
      if (Date.now() >= timeLimit && !hasSubmitted) {
        submitAllAnswers();
        setHasSubmitted(true);
      }
    };

    timerRef.current = setInterval(checkTime, 1000);
    return () => { timerRef.current && clearInterval(timerRef.current) };
  }, [timeLimit, hasSubmitted]);

  // Sync logic
  const syncWithServer = useCallback(async (force = false) => {
    try {
      const savedAnswers = localStorage.getItem(localStorageKey);
      if (!savedAnswers) return;

      const answers: LocalAnswer[] = JSON.parse(savedAnswers);
      const answersObj = Object.values(answers);
      const answersToSync = force ? answersObj : answersObj.filter(a => !a.synced);
      console.log("RAW answersObj", answersObj);
      console.log('Syncing answers:', answersToSync);
      if (!answersToSync.length && !force) return;

      setSyncStatus('syncing');
      const result = await syncTryout(answersToSync, '', true);

      if (result?.data?.time_limit) {
        setTimeLimit(new Date(result.data.time_limit).getTime());
      }
      setAnswers(prev => {
        const merged = { ...prev };
        result.data.answers?.forEach((sa: AnswerPayload) => {
          if (sa?.kode_soal) {
            merged[sa.kode_soal] = {
              ...sa,
              updatedAt: Date.now(),
              synced: true,
            };
          }
        });
        localStorage.setItem(localStorageKey, JSON.stringify(merged));
        return merged;
      });

      setLastSynced(new Date());
      setSyncStatus('idle');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
    }
  }, [localStorageKey]);

  // Initial load
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem(localStorageKey);
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
      
      const interval = setInterval(syncWithServer, 10000);
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Initial load error:', error);
    }
  }, [localStorageKey, syncWithServer]);

  // Answer handling
  const updateAnswer = useCallback((kodeSoal: string, jawaban: string | null) => {
    setAnswers(prev => {
      const updated = {
        ...prev,
        [kodeSoal]: {
          kode_soal: kodeSoal,
          jawaban,
          updatedAt: Date.now(),
          synced: false,
        }
      };
      localStorage.setItem(localStorageKey, JSON.stringify(updated));
      return updated;
    });
  }, [localStorageKey]);

  // Submission handler
  const submitAllAnswers = useCallback(async () => {
    if (hasSubmitted) return;

    try {
      setSubmitting(true);
      setSyncStatus('syncing');
      
      const answersToSubmit = Object.values(answers);
      const result = await progressTryout(answersToSubmit, '', true);

      localStorage.removeItem(localStorageKey);
      setHasSubmitted(true);
      if (timerRef.current) clearInterval(timerRef.current);

      alert('Answers submitted successfully!');
      return result;
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed. Please try again.');
      throw error;
    } finally {
      setSubmitting(false);
      setSyncStatus('idle');
    }
  }, [answers, hasSubmitted, localStorageKey]);

  // Render helpers
  const renderQuestionComponent = () => {
    if (!currentSoal) return <div className="p-4 text-center">Question content not available</div>;

    const commonProps = {
      soal: currentSoal,
      savedAnswer: answers[currentSoal.kode_soal]?.jawaban || null,
      onAnswerChange: (value: string) => updateAnswer(currentSoal.kode_soal, value)
    };

    switch (variant) {
      case 'multiple_choice':
        return currentSoal.pilihan_ganda ? <MultipleChoice {...commonProps} /> : null;
      case 'true_false':
        return currentSoal.true_false ? <TrueFalse {...commonProps} /> : null;
      default:
        return currentSoal.uraian ? <TextAnswer {...commonProps} /> : null;
    }
  };

  return (
    <StyledCard title='Jawaban' className='gap-1'>
      <main className='flex h-full flex-col'>
        {renderQuestionComponent()}

        <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
          <span>
            {syncStatus === 'syncing' ? 'Menyimpan...' : 
             syncStatus === 'error' ? 'Gagal sinkronisasi' : 
             lastSynced ? `Tersimpan: ${lastSynced.toLocaleTimeString()}` : 'Belum disimpan'}
          </span>
          
          <button 
            onClick={() => syncWithServer(true)}
            className="text-primary-500 hover:text-primary-600 text-xs"
            disabled={syncStatus === 'syncing'}
          >
            Simpan Sekarang
          </button>
        </div>

        <section className='mt-auto grid grid-cols-2 gap-2'>
          <Link
            href={clampedNumber > 1 ? `${basePath}/${clampedNumber - 1}` : pathname}
            className={cn(
              buttonVariants({ variant: 'secondaryOutline' }),
              'border-[1.5px]',
              clampedNumber === 1 && 'pointer-events-none opacity-50'
            )}
          >
            <ArrowLeft />
            Back
          </Link>

          {isLastQuestion ? (
            <button
              onClick={submitAllAnswers}
              disabled={submitting || syncStatus === 'syncing'}
              className={cn(
                buttonVariants({ variant: 'default' }),
                'flex items-center justify-center gap-2'
              )}
            >
              <Check size={16} />
              {submitting ? 'Submitting...' : 'Submit All'}
            </button>
          ) : (
            <Link
              href={`${basePath}/${clampedNumber + 1}`}
              className={buttonVariants({ variant: 'secondary' })}
            >
              Next
              <ArrowRight />
            </Link>
          )}
        </section>
      </main>
    </StyledCard>
  );
};

// Component implementations remain similar but with proper TypeScript typing
// Add interface definitions for each component's props
//
// Updated components to accept and manage saved answers
const MultipleChoice = ({ 
  soal, 
  savedAnswer,
  onAnswerChange
}: { 
  soal: any;
  savedAnswer: string | null;
  onAnswerChange: (value: string) => void;
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(savedAnswer);

  useEffect(() => {
    setSelectedAnswer(savedAnswer);
  }, [savedAnswer]);

  const handleSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    onAnswerChange(answerId);
  };

  return (
    <div className="mb-4">
      {soal.pilihan_ganda?.map((option: any, idx: number) => (
        <button
          key={option.soal_pilihan_ganda_id}
          className={`flex w-full items-center justify-between gap-4 rounded-lg px-4 py-4 text-start font-semibold transition-colors ease-in-out ${
            selectedAnswer === option.soal_pilihan_ganda_id
              ? 'bg-primary-500 text-white'
              : 'border-b border-neutral-200 text-black'
          }`}
          onClick={() => handleSelect(option.soal_pilihan_ganda_id)}
        >
          <div className='flex gap-4'>
            <span className='font-bold'>{String.fromCharCode(97 + idx)}.</span> {/* a, b, c, d */}
            {option.pilihan}
          </div>
        </button>
      ))}
    </div>
  );
};

const TextAnswer = ({ 
  soal,
  savedAnswer,
  onAnswerChange
}: { 
  soal: any;
  savedAnswer: string | null;
  onAnswerChange: (value: string) => void;
}) => {
  const [text, setText] = useState(savedAnswer || '');
  
  useEffect(() => {
    setText(savedAnswer || '');
  }, [savedAnswer]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    onAnswerChange(newValue);
  };

  return (
    <div className="mb-4">
      <Textarea 
        placeholder='Ketik jawabanmu disini' 
        value={text}
        onChange={handleChange}
      />
    </div>
  );
};

// Fixed TrueFalse component with proper typings and handling
const TrueFalse = ({
  soal,
  savedAnswer,
  onAnswerChange,
}: {
  soal: any;
  savedAnswer: string | null;
  onAnswerChange: (value: string) => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const prevAnswerRef = useRef<string | null>(null);

  // Initialize from saved answer
  useEffect(() => {
    if (savedAnswer === prevAnswerRef.current) return;
    prevAnswerRef.current = savedAnswer;

    if (!savedAnswer) {
      setSelectedOptions({});
      return;
    }

    try {
      const selected = savedAnswer.split(',').filter(Boolean).reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      setSelectedOptions(selected);
    } catch (error) {
      console.error('Error parsing saved true/false answers:', error);
      setSelectedOptions({});
    }
  }, [savedAnswer]);

  // Add this effect to handle answer changes
  useEffect(() => {
    // Skip initial render
    if (Object.keys(selectedOptions).length === 0 && !prevAnswerRef.current) return;
    
    const newAnswer = Object.keys(selectedOptions).join(',');
    
    // Only update if different from previous
    if (newAnswer !== prevAnswerRef.current) {
      prevAnswerRef.current = newAnswer;
      onAnswerChange(newAnswer);
    }
  }, [selectedOptions, onAnswerChange]);

  const handleSelect = (optionId: string, value: boolean) => {
    setSelectedOptions(prev => {
      const newOptions = { ...prev };
      
      if (value) {
        newOptions[optionId] = true;
      } else {
        delete newOptions[optionId];
      }
      
      return newOptions;
    });
    // Removed the onAnswerChange call from here
  };

  return (
    <div className="mb-4 flex flex-col gap-4">
      {soal.true_false?.map((option: any) => {
        const isSelected = selectedOptions[option.soal_true_false_id] === true;
        
        return (
          <div key={option.soal_true_false_id} className="flex items-center gap-4">
            <span className="w-40">{option.pilihan_tf}</span>

            <button
              onClick={() => handleSelect(option.soal_true_false_id, true)}
              className={`px-4 py-2 border rounded ${
                isSelected ? "bg-primary-500 text-white" : ""
              }`}
            >
              True
            </button>

            <button
              onClick={() => handleSelect(option.soal_true_false_id, false)}
              className={`px-4 py-2 border rounded ${
                !isSelected ? "bg-primary-500 text-white" : ""
              }`}
            >
              False
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AnswerCard;