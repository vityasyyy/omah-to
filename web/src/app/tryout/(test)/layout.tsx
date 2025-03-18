import Container from '@/components/container'
import TopBar from '@/components/tryout/top-bar'
import { getCurrentTryout, getSoal, syncTryout } from '@/lib/fetch/tryout-test'
import NumberCarousel from '@/modules/tryout/number-carousel'
import TryoutStatus from '@/modules/tryout/tryout-status'
import { cookies } from 'next/headers'
import { TryoutDataProvider } from './tryout-context'
import { fetchUserClient } from '@/lib/auth/fetch_user'
import { redirect } from 'next/navigation'
import { getFinishedAttempt } from '@/lib/fetch/tryout-page'

const TryoutLayout = async ({ children }: { children: React.ReactNode }) => {
  const tryoutToken = (await cookies()).get('tryout_token')?.value as string;
  const accessToken = (await cookies()).get('access_token')?.value as string;
  const finishedAttempt = await getFinishedAttempt(accessToken);
  if (finishedAttempt) {
    redirect('/tryout');
  }
  const currentSubtest = await getCurrentTryout(tryoutToken);
  if (currentSubtest == null) {
    redirect('/tryout');
  }
  const syncData = await syncTryout([], tryoutToken);
  if (syncData == null) {
    redirect('/tryout');
  }
  const timeLimit = syncData.data.time_limit;
  const grace = 30_000;
  const adjustedTimeLimit = new Date(new Date(timeLimit).getTime() - grace);
  const subtestSekarang = currentSubtest.data.subtest_sekarang;
  const soal = await getSoal(
    currentSubtest.data.subtest_sekarang,
    tryoutToken,
    false,
    true
  );
  const panjangSoal = soal.length;
  return (
    <main className='bg-neutral-25 min-h-screen'>
      <Container>
        <TopBar />
        <TryoutStatus time={adjustedTimeLimit} title={subtestSekarang}/>
        <NumberCarousel totalQuestions={panjangSoal} />
        <TryoutDataProvider currentSubtest={subtestSekarang} value={soal} time={adjustedTimeLimit}>{children}</TryoutDataProvider>
      </Container>
    </main>
  );
};

export default TryoutLayout;
