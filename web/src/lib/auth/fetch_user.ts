import { headers } from "next/headers";

export async function fetchUser() {
    const headersList = await headers();
    const username = headersList.get('x-user-username');
    const email = headersList.get('x-user-email');
    const asalSekolah = headersList.get('x-user-asal_sekolah');
    const id = headersList.get('x-user-id');
    return { username, email, asalSekolah, id };
}