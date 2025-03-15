'use client';

import StyledCard from '@/components/tryout/styled-card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { progressTryout, syncTryout } from '@/lib/fetch/tryout-test';

type Variant = 'multiple_choice' | 'true_false' | 'uraian';

interface AnswerCardProps {
  variant?: Variant;
  soal: any[];
  soalSemua: any[];
}

interface AnswerPayload {
  kode_soal: string;
  jawaban: string | null;
}

interface LocalAnswer extends AnswerPayload {
  updatedAt: number;
  synced: boolean;
}

const getLocalStorageKey = () => {
  return `tryout_answers_user`; // Consider a more dynamic key
};

const AnswerCard = ({ variant = 'multiple_choice', soalSemua }: AnswerCardProps) => {
  const pathname = usePathname();
  const basePath = pathname.slice(0, pathname.lastIndexOf('/'));
  const currentNumber = Number.parseInt(pathname.slice(pathname.lastIndexOf('/') + 1));
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({});
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [localStorageKey, setLocalStorageKey] = useState<string | null>(null);

  const totalQuestions = soalSemua.length;
  if (totalQuestions === 0) return <p>No questions available.</p>;

  const clampedNumber = Math.min(Math.max(currentNumber, 1), totalQuestions);
  const currentSoal = soalSemua[clampedNumber - 1];

  useEffect(() => {
    setLocalStorageKey(getLocalStorageKey());
  }, []);

  const syncWithServer = useCallback(
    async (force = false) => {
      if (!localStorageKey) return;

      try {
        const unsyncedAnswers = Object.values(answers).filter((answer) => !answer.synced);
        if (Object.keys(answers).length === 0 || (unsyncedAnswers.length === 0 && !force)) return;

        setSyncStatus('syncing');
        console.log("UNSYNCED", unsyncedAnswers);
        const answersToSync = unsyncedAnswers.map((answer) => ({
          kode_soal: answer.kode_soal,
          jawaban: answer.jawaban,
        }));
        const result = await syncTryout(answersToSync, '', true);
        const serverAnswers = result.data.answers;
        const newTimeLimit = result.data.time_limit;

        if (newTimeLimit) setTimeLimit(newTimeLimit);

        setAnswers((prevAnswers) => {
          const mergedAnswers = { ...prevAnswers };
          serverAnswers.forEach((serverAnswer: AnswerPayload) => {
            mergedAnswers[serverAnswer.kode_soal] = {
              ...serverAnswer,
              updatedAt: Date.now(),
              synced: true,
            };
          });

          localStorage.setItem(localStorageKey, JSON.stringify(mergedAnswers));
          return mergedAnswers;
        });

        setLastSynced(new Date());
        setSyncStatus('idle');
      } catch (error) {
        console.error('Sync error:', error);
        setSyncStatus('error');
      }
    },
    [localStorageKey]
  );

  useEffect(() => {
    if (!localStorageKey) return;

    const savedAnswers = localStorage.getItem(localStorageKey);
    const parsedAnswers = savedAnswers ? JSON.parse(savedAnswers) : {};
    setAnswers(parsedAnswers);

    syncWithServer(true);

    const syncInterval = setInterval(() => syncWithServer(), 60000); // Reduced interval to 60 seconds

    return () => clearInterval(syncInterval);
  }, [localStorageKey, syncWithServer]);

  const updateAnswer = (kodeSoal: string, jawaban: string | null) => {
    if (!localStorageKey) return;

    setAnswers((prev) => {
      const updatedAnswers = {
        ...prev,
        [kodeSoal]: {
          kode_soal: kodeSoal,
          jawaban: jawaban,
          updatedAt: Date.now(),
          synced: false,
        },
      };

      localStorage.setItem(localStorageKey, JSON.stringify(updatedAnswers));
      syncWithServer(); // Sync after each answer update
      return updatedAnswers;
    });
  };

  const submitAllAnswers = async () => {
    if (!localStorageKey) return;

    try {
      setSyncStatus('syncing');

      const answersToSubmit = Object.values(answers).map((answer) => ({
        kode_soal: answer.kode_soal,
        jawaban: answer.jawaban,
      }));

      const result = await progressTryout(answersToSubmit, '', true);

      const syncedAnswers = Object.fromEntries(
        Object.entries(answers).map(([key, value]) => [key, { ...value, synced: true }])
      );

      setAnswers(syncedAnswers);
      setLastSynced(new Date());
      setSyncStatus('idle');

      localStorage.setItem(localStorageKey, JSON.stringify(syncedAnswers));

      return result;
    } catch (error) {
      console.error('Submit error:', error);
      setSyncStatus('error');
      throw error;
    }
  };

  return (
    <StyledCard title='Jawaban' className='gap-1'>
      <main className='flex h-full flex-col'>
        {variant === 'multiple_choice' ? (
          <MultipleChoice 
            soal={currentSoal} 
            savedAnswer={answers[currentSoal.kode_soal]?.jawaban || null}
            onAnswerChange={(value) => updateAnswer(currentSoal.kode_soal, value)}
          />
        ) : variant === 'true_false' ? (
          <TrueFalse 
            soal={currentSoal} 
            savedAnswers={{ jawaban: answers[currentSoal.kode_soal]?.jawaban || null }}
            onAnswerChange={(value) => updateAnswer(currentSoal.kode_soal, value.jawaban || null)}
          />
        ) : (
          <TextAnswer 
            soal={currentSoal} 
            savedAnswer={answers[currentSoal.kode_soal]?.jawaban || null}
            onAnswerChange={(value) => updateAnswer(currentSoal.kode_soal, value)}
          />
        )}

        {/* Sync status indicator */}
        <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
          <span>
            {syncStatus === 'syncing' ? 'Menyimpan...' : 
             syncStatus === 'error' ? 'Gagal sinkronisasi' : 
             lastSynced ? `Tersimpan: ${lastSynced.toLocaleTimeString()}` : 'Belum disimpan'}
          </span>
          
          {/* Manual sync button */}
          <button 
            onClick={() => syncWithServer(true)}
            className="text-primary-500 hover:text-primary-600 text-xs"
            disabled={syncStatus === 'syncing'}
          >
            Simpan Sekarang
          </button>
        </div>

        {/* Back + Next Buttons */}
        <section className='mt-auto grid grid-cols-2 gap-2'>
          <Link
            href={clampedNumber > 1 ? `${basePath}/${clampedNumber - 1}` : pathname}
            className={cn(
              buttonVariants({ variant: 'secondaryOutline' }),
              'border-[1.5px]',
              clampedNumber === 1 ? 'pointer-events-none opacity-50' : ''
            )}
            onClick={() => syncWithServer(true)} // Sync when navigating
          >
            <ArrowLeft />
            Back
          </Link>

          <Link
            href={clampedNumber < totalQuestions ? `${basePath}/${clampedNumber + 1}` : pathname}
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              clampedNumber === totalQuestions ? 'pointer-events-none opacity-50' : ''
            )}
            onClick={() => syncWithServer(true)} // Sync when navigating
          >
            Next
            <ArrowRight />
          </Link>
        </section>
      </main>
    </StyledCard>
  );
};

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
    <>
      {soal.pilihan_ganda && (
        <div className="mb-4">
          {soal.pilihan_ganda.map((option: any, idx: number) => (
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
      )}
    </>
  )
}

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
    <>
      {soal.uraian && (
        <div className="mb-4">
          <Textarea 
            placeholder='Ketik jawabanmu disini' 
            value={text}
            onChange={handleChange}
          />
        </div>
      )}
    </>
  )
}

const TrueFalse = ({
  soal,
  savedAnswers,
  onAnswerChange,
}: {
  soal: any;
  savedAnswers: { jawaban: string | null };
  onAnswerChange: (newAnswers: { jawaban: string | null }) => void;
}) => {
  const [jawaban, setJawaban] = useState<string>(savedAnswers?.jawaban || "");

  useEffect(() => {
    setJawaban(savedAnswers?.jawaban || "");
  }, [savedAnswers]);

  const handleAnswerChange = (id: string, isSelect: boolean) => {
    let updatedJawaban = jawaban.split(",").filter(Boolean); // Convert to array, remove empty items

    if (isSelect) {
      if (!updatedJawaban.includes(id)) {
        updatedJawaban.push(id);
      }
    } else {
      updatedJawaban = updatedJawaban.filter((answerId) => answerId !== id);
    }

    const newJawaban = updatedJawaban.join(","); // Convert back to string
    setJawaban(newJawaban);
    onAnswerChange({ jawaban: newJawaban });
  };

  return (
    <div className="mb-4 flex flex-col gap-4">
      {soal.true_false?.map((option: any) => (
        <div key={option.soal_true_false_id} className="flex items-center gap-4">
          <span className="w-40">{option.pilihan_tf}</span>

          <button
            onClick={() => handleAnswerChange(option.soal_true_false_id, true)}
            className={`px-4 py-2 border rounded ${
              jawaban.split(",").includes(option.soal_true_false_id)
                ? "bg-primary-500 text-white"
                : ""
            }`}
          >
            True
          </button>

          <button
            onClick={() => handleAnswerChange(option.soal_true_false_id, false)}
            className="px-4 py-2 border rounded"
          >
            False
          </button>
        </div>
      ))}
    </div>
  );
};


export default AnswerCard;