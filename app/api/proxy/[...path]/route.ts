import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE || "https://all-api-node.vercel.app";

// Headers that should not be forwarded to/from the upstream API
const HOP_BY_HOP_HEADERS = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
];

async function forward(req: NextRequest, pathArray: string[] | string) {
  try {
    const path = Array.isArray(pathArray) ? pathArray.join("/") : String(pathArray);
    const target = new URL(`${API_BASE}/${path}`);

    // Preserve incoming query parameters
    const incomingSearch = req.nextUrl.search;
    if (incomingSearch) target.search = incomingSearch;

    // Filter incoming headers
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      if (HOP_BY_HOP_HEADERS.includes(key.toLowerCase())) return;
      headers.set(key, value);
    });

    // Special handling for login routes (direct browser redirect to provider)
    if (req.method === "GET" && path.toLowerCase().includes("/auth/login")) {
      console.log("Proxying login redirect to:", target.toString());
      return NextResponse.redirect(target.toString(), 307);
    }

    // Prepare request body
    let body: any = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.arrayBuffer();
    }

    // Proxy the request to the upstream API
    const res = await fetch(target.toString(), {
      method: req.method,
      headers,
      body,
      redirect: "manual", // Let the browser handle redirects (301/302)
    });

    const responseHeaders = new Headers();
    res.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      // Skip hop-by-hop and problematic headers
      if (HOP_BY_HOP_HEADERS.includes(lowerKey)) return;
      if (lowerKey === "set-cookie") return; // Handled below
      if (lowerKey === "content-encoding") return; // Let Next.js handle compression
      if (lowerKey === "content-length") return; // Let Response calculate it

      responseHeaders.set(key, value);
    });

    // Handle Set-Cookie headers correctly (supports multiple)
    const setCookies = (res.headers as any).getSetCookie?.() || res.headers.get("set-cookie");
    if (setCookies) {
      const cookiesArray = Array.isArray(setCookies) ? setCookies : [setCookies];
      cookiesArray.forEach(c => responseHeaders.append("Set-Cookie", c));
    }

    // If upstream returned a redirect, we must pass it through to the browser
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (location) {
        // If location is relative, we could make it absolute if needed,
        // but browser should handle it relative to the proxy URL.
        return new Response(null, {
          status: res.status,
          headers: responseHeaders,
        });
      }
    }

    const resBody = await res.arrayBuffer();
    return new Response(resBody, {
      status: res.status,
      headers: responseHeaders,
    });

  } catch (error: any) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { error: "Proxy failure", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, context: any) {
  const ctxParams = await (context?.params ?? {});
  return forward(req, ctxParams.path || "");
}
export async function POST(req: NextRequest, context: any) {
  const ctxParams = await (context?.params ?? {});
  return forward(req, ctxParams.path || "");
}
export async function PUT(req: NextRequest, context: any) {
  const ctxParams = await (context?.params ?? {});
  return forward(req, ctxParams.path || "");
}
export async function DELETE(req: NextRequest, context: any) {
  const ctxParams = await (context?.params ?? {});
  return forward(req, ctxParams.path || "");
}
export async function PATCH(req: NextRequest, context: any) {
  const ctxParams = await (context?.params ?? {});
  return forward(req, ctxParams.path || "");
}
