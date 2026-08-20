import { NextRequest } from "next/server";

const API_BASE = process.env.API_BASE || "https://all-api-node.vercel.app";

async function forward(req: NextRequest, pathArray: string[] | string) {
  const path = Array.isArray(pathArray) ? pathArray.join("/") : String(pathArray);
  // Build target URL and preserve incoming query string
  const target = new URL(`${API_BASE}/${path}`);
  try {
    const incomingSearch = req.nextUrl?.search || new URL(req.url).search || "";
    if (incomingSearch) target.search = incomingSearch;
  } catch (e) {
    // ignore
  }

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() === "host") return;
    headers[key] = value as string;
  });

  // For OAuth login routes, redirect the browser to the upstream domain so the provider
  // pages and cookies are served from the API's domain. Health check already ran above.
  try {
    const lowerPath = path.toLowerCase();
    if (req.method === "GET" && lowerPath.includes("/auth/login")) {
      return Response.redirect(target.toString(), 307);
    }
  } catch (e) {
    // ignore and continue to proxy fetch
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
    redirect: "manual",
  };

  const res = await fetch(target.toString(), init);
  const responseHeaders = new Headers();

  // Forward all headers from the upstream response
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return; // Handle separately below
    if (key.toLowerCase() === "content-encoding") return; // Let Next.js handle compression
    responseHeaders.set(key, value);
  });

  // Correctly handle multiple Set-Cookie headers
  const setCookies = (res.headers as any).getSetCookie?.() || res.headers.get("set-cookie");
  if (setCookies) {
    if (Array.isArray(setCookies)) {
      setCookies.forEach((c) => responseHeaders.append("Set-Cookie", c));
    } else {
      responseHeaders.set("Set-Cookie", setCookies);
    }
  }

  const body = await res.arrayBuffer();

  return new Response(body, {
    status: res.status,
    headers: responseHeaders,
  });
}

// Note: context.params can be a Promise in newer Next.js versions — await it before use
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
