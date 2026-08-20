import { NextRequest } from "next/server";

const API_BASE = process.env.API_BASE || "https://all-api.vercel.app";

function looksLikeUser(obj: any) {
  if (!obj || typeof obj !== "object") return false;
  const keys = Object.keys(obj);
  const userHints = ["id", "user", "username", "email", "name", "avatar", "avatar_url", "picture"];
  return userHints.some((k) => keys.includes(k));
}

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  console.log("Session check - cookies present:", !!cookie);
  
  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
      method: "GET",
      headers: { cookie },
      credentials: "include",
    });
    
    console.log("Session check - API response status:", res.status);

    if (!res.ok) {
      return new Response(JSON.stringify({ loggedIn: false }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    const contentType = (res.headers.get("content-type") || "").toLowerCase();

    if (!contentType.includes("application/json")) {
      // upstream returned HTML/text (likely homepage) — treat as not logged in
      const text = await res.text().catch(() => "");
      // quick heuristic: if content contains the API welcome message, it's the homepage
      if (text.includes("Welcome to the All API") || text.trim().length < 50) {
        return new Response(JSON.stringify({ loggedIn: false }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
      // otherwise still treat as not logged in
      return new Response(JSON.stringify({ loggedIn: false }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    const json = await res.json().catch(() => null);
    // some APIs nest user under `user` or return simple user object
    const user = json && looksLikeUser(json) ? (json.user ? json.user : json) : null;

    if (user) {
      return new Response(JSON.stringify({ loggedIn: true, user }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    // JSON but not a user object — treat as not logged in
    return new Response(JSON.stringify({ loggedIn: false, raw: json }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ loggedIn: false, error: String(e) }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
}
