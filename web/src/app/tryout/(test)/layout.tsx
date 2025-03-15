import Container from '@/components/container'
import TopBar from '@/components/tryout/top-bar'
import { getCurrentTryout, getSoal } from '@/lib/fetch/tryout-test'
import NumberCarousel from '@/modules/tryout/number-carousel'
import TryoutStatus from '@/modules/tryout/tryout-status'
import { cookies } from 'next/headers'
import { TryoutDataProvider } from './tryout-context'

const TryoutLayout = async ({ children }: { children: React.ReactNode }) => {
  const tryoutToken = (await cookies()).get('tryout_token')?.value as string;
  const currentSubtest = await getCurrentTryout(tryoutToken);
  const soal = await getSoal(
    currentSubtest.data.subtest_sekarang,
    tryoutToken,
    false,
    true
  );

  return (
    <main className='bg-neutral-25 min-h-screen'>
      <Container>
        <TopBar />
        <TryoutStatus title={currentSubtest.data.subtest_sekarang} />
        <NumberCarousel totalQuestions={soal.length} />
        <TryoutDataProvider value={soal}>{children}</TryoutDataProvider>
      </Container>
    </main>
  );
};

export default TryoutLayout;
