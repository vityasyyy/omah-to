// lib/auth-helpers.js
import { cookies } from "next/headers";

export async function validateUserAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken && !accessToken) {
    return { valid: false };
  }

  // Try to validate with access token
  const res = await fetch(`${process.env.AUTH_URL}/auth/validateprofile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `access_token=${accessToken}`,
    },
    credentials: "include",
  });

  if (res.ok) {
    const userData = await res.json();
    return { valid: true, userData };
  }

  // If access token failed but we have a refresh token, attempt refresh
  if (refreshToken) {
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const refreshRes = await fetch(`${origin}/api/refresh-token`, {
      method: "GET",
      headers: {
        "Cookie": `refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });

    if (refreshRes.ok) {
      // Extract the new access token from the response cookies
      const newCookies = refreshRes.headers.get("set-cookie") || "";
      const accessTokenMatch = newCookies.match(/access_token=([^;]+)/); // Extract access_token from set-cookie
      const refreshTokenMatch = newCookies.match(/refresh_token=([^;]+)/); // Extract refresh_token from set-cookie
      if (!accessTokenMatch) {
        return { valid: false }; // Refresh failed
      }
      if (!refreshTokenMatch) {
        return { valid: false }; // Refresh failed
      }
      const newAccessToken = accessTokenMatch[1]; // Extract token value
      const newRefreshToken = refreshTokenMatch[1]; // Extract token value
      const newTokens = { accessToken: newAccessToken, refreshToken: newRefreshToken};
      console.log(newTokens);
      // Retry validation with the new access token
      const validationRetry = await fetch(`${process.env.AUTH_URL}/auth/validateprofile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `access_token=${newAccessToken}`, // Use the refreshed token
        },
        credentials: "include",
      });

      if (validationRetry.ok) {
        const userData = await validationRetry.json();
        return { valid: true, userData, newTokens };
      }
    }
  }

  return { valid: false };
}
