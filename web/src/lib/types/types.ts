export type SubtestScore = {
  user_id: number
  attempt_id: number
  subtest: string
  score: number
}

export type SubtestsScoreResponse = {
  data: SubtestScore[]
} | null

export type User = {
  username: string 
  email: string 
  asal_sekolah: string 
  user_id: number | string
} | null

export type Leaderboard = {
  username: string | null
  score: number | null
}
export type LeaderboardResponse = {
  data: Leaderboard[]
} | null

export type Jawaban = {
  kode_soal: string
  jawaban: string | null
}
