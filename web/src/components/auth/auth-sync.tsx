'use client';

import { useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';

const AuthSync = ({ newTokens }: { newTokens: any }) => {
  useEffect(() => {
    if (!newTokens?.accessToken || !newTokens?.refreshToken) return;

    const existingRefreshToken = getCookie('refreshToken');

    // Only update if the refresh token is new
    if (existingRefreshToken !== newTokens.refreshToken) {
      console.log('Updating tokens...');

      setCookie('access_token', newTokens.accessToken, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        secure: true, // Secure in production
        sameSite: 'lax', // Use Lax for better compatibility
        path: '/',
        httpOnly: true,
      });

      setCookie('refresh_token', newTokens.refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        secure: true,
        sameSite: 'lax',
        httpOnly: true, // cookies-next supports httpOnly on server-side
        path: '/',
      });
    }
  }, [newTokens]);

  return null;
};

export default AuthSync;
