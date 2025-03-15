// app/api/tryout/progress/route.ts (for App Router)
// or pages/api/tryout/progress.js (for Pages Router)
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
      const { answers } = await req.json();
      const cookies = req.headers.get('cookie');
      
      // Forward the request to your backend
      const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8080';
      const response = await fetch(`${backendUrl}/api/tryout/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies || '', // Forward cookies (including tryout_token)
        },
        body: JSON.stringify({ answers }), // Match backend's expected format
      });
      
      // Get response data
      const responseData = await response.json();
      
      if (!response.ok) {
        return NextResponse.json(
          { message: 'Error from backend', error: responseData.error },
          { status: response.status }
        );
      }
      
      // Return success with data
      return NextResponse.json(responseData);
    } catch (error) {
      console.error('Error in progress route:', error);
      return NextResponse.json(
        { message: 'Internal server error', error: (error as Error).message },
        { status: 500 }
      );
    }
  }