import { headers } from "next/headers";

export async function fetchUser() {
    const headersList = await headers();
    const username = headersList.get('x-user-username');
    const email = headersList.get('x-user-email');
    const asalSekolah = headersList.get('x-user-asal_sekolah');
    const id = headersList.get('x-user-id');
    return { username, email, asalSekolah, id };
}

export const fetchUserClient = async (accessToken?: string) => {
    const res = await fetch(`${process.env.AUTH_URL}/auth/validateprofile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `access_token=${accessToken}`
        },
        credentials: 'include'
    })
    if (res.ok) {
        return await res.json();
    }
    return null;
}