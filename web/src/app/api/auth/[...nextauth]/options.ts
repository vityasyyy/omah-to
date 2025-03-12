import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import cookie from 'cookie';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.AUTH_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            credentials: 'include',
          });

          if (!res.ok) return null;

          const setCookieHeader = res.headers.get('set-cookie');
          console.log("COOKIE HEADER:", setCookieHeader);
          if (setCookieHeader) {
            const parsedCookies = cookie.parse(setCookieHeader);
            console.log("PARSED COOKIES:", parsedCookies);
            if (parsedCookies.access_token) {
              (await cookies()).set('access_token', parsedCookies.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60,
                path: '/',
              });
            }

            if (parsedCookies.refresh_token) {
              (await cookies()).set('refresh_token', parsedCookies.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60,
                path: '/',
              });
            }
          }

          const user = await res.json();
          console.log(user);
          return { ...user, username: user.nama_user, email: user.email, asal_sekolah: user.asal_sekolah };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        const accessToken = (await cookies()).get('access_token')?.value;
        const refreshToken = (await cookies()).get('refresh_token')?.value;

        if (!accessToken || !refreshToken) return session;

        // Validation without Bearer token. Relying on cookies.
        const res = await fetch(`${process.env.AUTH_URL}/auth/validateprofile`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          session.user = await res.json();
          return session;
        } else {
          // Token validation failed, attempt to refresh
          const refreshRes = await fetch(`${process.env.AUTH_URL}/user/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshSetCookieHeader = refreshRes.headers.get('set-cookie');

            if(refreshSetCookieHeader){
              const parsedCookies = cookie.parse(refreshSetCookieHeader);
              console.log(parsedCookies);
              if (parsedCookies.access_token) {
                (await cookies()).set('access_token', parsedCookies.access_token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax',
                  maxAge: 15 * 60,
                  path: '/',
                });
              }

              if (parsedCookies.refresh_token) {
                (await cookies()).set('refresh_token', parsedCookies.refresh_token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax',
                  maxAge: 7 * 24 * 60 * 60,
                  path: '/',
                });
              }
            }

            // Retry validation with the new cookies.
            const retryRes = await fetch(`${process.env.AUTH_URL}/auth/validateprofile`, {
              method: 'GET',
              credentials: 'include',
            });

            if (retryRes.ok) {
              session.user = await retryRes.json();
              return session;
            } else {
              // Retry validation failed, log out the user
              console.error('Retry validation failed after refresh');
              (await cookies()).delete('access_token');
              (await cookies()).delete('refresh_token');
              //consider redirecting the user to login page.
              return session;
            }
          } else {
            // Refresh failed, log out the user
            console.error('Token refresh failed');
            (await cookies()).delete('access_token');
            (await cookies()).delete('refresh_token');
            //consider redirecting the user to login page.
            return session;
          }
        }
      } catch (error) {
        console.error('Session error:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/login',
  },
}