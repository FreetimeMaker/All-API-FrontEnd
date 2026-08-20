import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const next = searchParams.get("next") || "/dashboard";
  const error = searchParams.get("error");
  
  // Log callback parameters for debugging
  console.log("API auth callback received:", Object.fromEntries(searchParams.entries()));
  
  // Check for error parameters
  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(new URL("/login?error=" + encodeURIComponent(error), req.url));
  }

  // Redirect to the frontend callback page which will handle the session check
  const callbackUrl = new URL("/auth/callback", req.url);
  callbackUrl.searchParams.set("next", next);
  
  return NextResponse.redirect(callbackUrl);
}