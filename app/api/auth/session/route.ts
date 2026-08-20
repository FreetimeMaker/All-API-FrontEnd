import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE || "https://all-api-node.vercel.app";

export async function GET(req: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    // Try to get the session from the API
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
      method: "GET",
      credentials: "include",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      
      // Forward the session cookies from the API response
      const response = NextResponse.json({ 
        loggedIn: true, 
        user: data 
      });

      // Copy any Set-Cookie headers from the API response
      const setCookies = (res.headers as any).getSetCookie?.() || res.headers.get("set-cookie");
      if (setCookies) {
        const cookiesArray = Array.isArray(setCookies) ? setCookies : [setCookies];
        cookiesArray.forEach(c => response.headers.append("Set-Cookie", c));
      }

      return response;
    }

    return NextResponse.json({ loggedIn: false }, { status: 200 });
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Session check error:", error);
    return NextResponse.json({ loggedIn: false, error: String(error) }, { status: 200 });
  }
}