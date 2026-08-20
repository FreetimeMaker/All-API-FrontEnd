import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE || "https://all-api-node.vercel.app";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider");
  const next = searchParams.get("next") || "/dashboard";
  
  if (!provider) {
    return NextResponse.json({ error: "Provider required" }, { status: 400 });
  }

  // Redirect to the API's login endpoint
  const apiUrl = `${API_BASE}/api/v1/auth/login?provider=${provider}&next=${encodeURIComponent(req.nextUrl.origin + '/api/auth/callback?next=' + encodeURIComponent(next))}`;
  
  return NextResponse.redirect(apiUrl);
}