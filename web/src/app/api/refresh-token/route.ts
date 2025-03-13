// app/api/refresh-token/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Get cookies from the request
  const cookieStore = request.cookies;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }
  
  try {
    const refreshRes = await fetch(`${process.env.AUTH_URL}/user/refresh`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });
    
    if (!refreshRes.ok) {
      return NextResponse.json({ error: "Failed to refresh token" }, { status: 401 });
    }
    const resBody = await refreshRes.json();
    const { newAccessToken, newRefreshToken } = resBody;
    console.log(resBody);
    // Create a response with the tokens in the body and as cookies
    const response = NextResponse.json({ 
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
    
    // Set cookies on the response
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });
    
    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });
    
    return response;
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}