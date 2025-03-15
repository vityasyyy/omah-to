import { TRYOUT_URL } from "@/types/url";
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