import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE || "https://all-api-node.vercel.app";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const access_token = searchParams.get("access_token");
  const error = searchParams.get("error");

  // Handle errors from OAuth provider
  if (error) {
    return NextResponse.redirect(new URL("/login?error=" + encodeURIComponent(error), req.url));
  }

  // Check if access_token is present
  if (!access_token) {
    return NextResponse.redirect(new URL("/login?error=no_token", req.url));
  }

  try {
    // Exchange the access_token for a session by calling the API
    const response = await fetch(`${API_BASE}/api/v1/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token }),
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Token exchange failed:", response.status, response.statusText);
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", req.url));
    }

    // Get the response data and forward cookies
    const responseHeaders = new Headers();
    
    // Forward Set-Cookie headers from the API response
    const setCookies = (response.headers as any).getSetCookie?.() || response.headers.get("set-cookie");
    if (setCookies) {
      const cookiesArray = Array.isArray(setCookies) ? setCookies : [setCookies];
      cookiesArray.forEach(c => responseHeaders.append("Set-Cookie", c));
    }

    // Redirect to dashboard on successful login
    const redirectResponse = NextResponse.redirect(new URL("/dashboard", req.url));
    
    // Copy the Set-Cookie headers to the redirect response
    if (setCookies) {
      const cookiesArray = Array.isArray(setCookies) ? setCookies : [setCookies];
      cookiesArray.forEach(c => redirectResponse.headers.append("Set-Cookie", c));
    }

    return redirectResponse;

  } catch (error: any) {
    console.error("Callback error:", error);
    return NextResponse.redirect(new URL("/login?error=callback_error", req.url));
  }
}