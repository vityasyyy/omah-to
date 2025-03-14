const TRYOUT_URL = process.env.TRYOUT_URL as string;
const AUTH_URL = process.env.AUTH_URL as string;
const MINAT_BAKAT_URL = process.env.MINAT_BAKAT_URL as string;
const SOAL_URL = process.env.SOAL_URL as string;

import { SubtestsScoreResponse, LeaderboardResponse } from "@/types/types";

export const getSubtestsScore = async (accessToken: string): Promise<SubtestsScoreResponse> => {
    const res = await fetch(`${TRYOUT_URL}/tryout/subtests-score`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`
        },
        credentials: 'include'
    });
    if (res.ok) {
        const responseJSON = await res.json();
        return responseJSON;
    }
    return null;
}

export const getLeaderboard = async (accessToken: string): Promise<LeaderboardResponse> => {
    const res = await fetch(`${TRYOUT_URL}/tryout/leaderboard`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`
        },
        credentials: 'include'
    });
    if (res.ok) {
        const responseJSON = await res.json();
        return responseJSON;
    }
    return null;
}