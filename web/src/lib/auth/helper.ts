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

  // If validation succeeded, return success
  if (res.ok) {
    const userData = await res.json();
    return { valid: true, userData };
  }

  // If access token failed but we have refresh token, try to refresh
  if (refreshToken) {
    const refreshRes = await fetch(`${process.env.AUTH_URL}/user/refresh`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });
    console.log("HEADERS:", refreshRes.headers)
    if (refreshRes.ok) {
        const { newAccessToken, newRefreshToken } = await refreshRes.json();
        // Set new tokens as cookies
        console.log(newAccessToken);

      // Successfully refreshed token, validate again with new token
      const validationRetry = await fetch(`${process.env.AUTH_URL}/auth/validateprofile`, {
        method: "GET",
        credentials: "include", // Use newly set cookies
        headers: {
          "Content-Type": "application/json",
          "Cookie": `access_token=${newAccessToken}`,
        },
      });
      console.log(validationRetry)
      if (validationRetry.ok) {
        const userData = await validationRetry.json();
        return { valid: true, userData };
      }
    }
  }
  
  // If we got here, authentication failed
  return { valid: false };
}