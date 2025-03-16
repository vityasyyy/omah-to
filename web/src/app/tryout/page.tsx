import Container from '@/components/container'
import TopBar from '@/components/tryout/top-bar'
import HistoryCard from '@/modules/tryout/dashboard/history-card'
import ProfileCard from '@/modules/tryout/dashboard/profile-card'
import RankingCard from '@/modules/tryout/dashboard/ranking-card'
import StartCard from '@/modules/tryout/dashboard/start-card'

import { cookies } from 'next/headers'
import { getSubtestsScore, getLeaderboard } from '@/lib/fetch/tryout-page'
import { fetchUser } from '@/lib/auth/fetch_user'
import { getOngoingAttempt, getFinishedAttempt } from '@/lib/fetch/tryout-page'
const TryOutPage = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value as string;
  const subtestsScore = await getSubtestsScore(accessToken);
  const leaderboard = await getLeaderboard(accessToken);
  const userData = await fetchUser();
  const ongoing = await getOngoingAttempt(accessToken);
  const finished = await getFinishedAttempt(accessToken);
  return (
    <main className='bg-neutral-50 min-h-screen'>
      <Container>
        <TopBar />

        <section className='flex flex-col-reverse gap-4 md:grid md:grid-cols-4'>
          <StartCard status={ongoing ? 'ongoing' : finished ? 'finished' : 'none'}/>
          <ProfileCard user={{
            username: userData.username,
            asal_sekolah: userData.asalSekolah,
            user_id: Number(userData.id),
            email: userData.email
          }}/>
        </section>
        <section className='grid gap-4 grid-cols-1 md:grid-cols-2'>
          <HistoryCard score={subtestsScore}/>
          <RankingCard leaderboard={leaderboard}/>
        </section>
      </Container>
    </main>
  )
}

export default TryOutPage
