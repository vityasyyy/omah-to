import { cookies } from 'next/headers'
import TryoutResult from '@/modules/tryout/tryout-result'
import { getPembahasanPaket1 } from '@/lib/fetch/tryout-page'

const Page = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value as string
  const pembahasanData = await getPembahasanPaket1(accessToken)
  const enrichedAnswers = pembahasanData.data?.enriched_answers
  const userScores = pembahasanData.data?.subtests_scores
  const rank = pembahasanData.data?.rank

  return (
    <TryoutResult
      userScores={userScores}
      userAnswers={enrichedAnswers}
      totalRank={rank} // Optional
    />
  )
}

export default Page
