import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { progress } = await req.json();

    // Extract only the tryout_token from cookies
    const cookieStore = await cookies();
    const tryoutToken = cookieStore.get("tryout_token")?.value || "";

    // Forward the request to your backend
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8080";
    const response = await fetch(`${backendUrl}/api/tryout/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `tryout_token=${tryoutToken}`, // Only include tryout_token
      },
      body: JSON.stringify({ progress }), // Match backend's expected format
    });

    // Get response data
    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: "Error from backend", error: responseData.error },
        { status: response.status }
      );
    }

    // Return success with data
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in progress route:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
