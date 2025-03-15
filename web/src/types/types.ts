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
username: string | null
email: string | null
asal_sekolah: string | null
user_id: number | null
}

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