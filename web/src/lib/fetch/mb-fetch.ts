/* eslint-disable @typescript-eslint/no-explicit-any */
import { SOAL_URL, MINAT_BAKAT_URL, PUBLIC_MINAT_BAKAT_URL, PUBLIC_SOAL_URL } from "@/lib/types/url";

export const getMbUrl = (isPublic?: boolean) => {
    return isPublic ? PUBLIC_MINAT_BAKAT_URL : MINAT_BAKAT_URL;
};

export const getSoalUrl = (isPublic?: boolean) => {
  return isPublic ? PUBLIC_SOAL_URL : SOAL_URL;
};

export const getMbSoal = async (accessToken?: string, isPublic?: boolean) => {
    const soalUrl = getSoalUrl(isPublic);
    const res = await fetch(`${soalUrl}/soal/minat-bakat`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Cookie": `access_token=${accessToken}`
        },
        cache: "force-cache",
        next: {revalidate: 3600},
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch soal");
    }
    
    return res.json();
}

export const submitMbAnswers = async (answers: any, isPublic?: boolean, accessToken?: string) => {
    const mbUrl = getMbUrl(isPublic);
    const res = await fetch(`${mbUrl}/minat-bakat/process`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Cookie": `access_token=${accessToken}`
        },
        credentials: "include",
        body: JSON.stringify(answers),
    });
    if (!res.ok) {
        throw new Error("Failed to submit answers");
    }
    
    return res.json();
}

export const getMbAttempt = async (accessToken?: string, isPublic?: boolean) => {
    const mbUrl = getMbUrl(isPublic);
    const res = await fetch(`${mbUrl}/minat-bakat/attempt`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Cookie": `access_token=${accessToken}`
        },
        credentials: "include",
        cache: "force-cache",
        next: {revalidate: 3600}
    });
    if (res.ok) {
        const responseJSON = await res.json();
        return responseJSON;
    }
    return null;
}