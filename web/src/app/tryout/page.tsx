import Container from '@/components/container'
import TopBar from '@/components/tryout/top-bar'
import HistoryCard from '@/modules/tryout/dashboard/history-card'
import ProfileCard from '@/modules/tryout/dashboard/profile-card'
import RankingCard from '@/modules/tryout/dashboard/ranking-card'
import StartCard from '@/modules/tryout/dashboard/start-card'

const TryOutPage = () => {
  return (
    <main className='bg-neutral-50 min-h-screen'>
      <Container>
        <TopBar />

        <section className='flex flex-col-reverse gap-4 md:grid md:grid-cols-4'>
          <StartCard />
          <ProfileCard />
        </section>
        <section className='grid gap-4 grid-cols-1 md:grid-cols-2'>
          <HistoryCard />
          <RankingCard />
        </section>
      </Container>
    </main>
  )
}

export default TryOutPage
