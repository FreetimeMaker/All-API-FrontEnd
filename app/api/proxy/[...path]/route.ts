import { NextRequest } from "next/server";

const API_BASE = process.env.API_BASE || "https://all-api-node.vercel.app";
const HEALTH_PATH = "/api/v1/health";
const HEALTH_TIMEOUT = 3000;

async function checkHealth() {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), HEALTH_TIMEOUT);
  try {
    const res = await fetch(`${API_BASE}${HEALTH_PATH}`, { signal: controller.signal });
    const json = await res.json().catch(() => null);
    clearTimeout(id);
    return { ok: res.ok, status: res.status, body: json };
  } catch (e) {
    clearTimeout(id);
    return { ok: false, error: String(e) };
  }
}

async function forward(req: NextRequest, pathArray: string[] | string) {
  // run health check first
  const health = await checkHealth();
  if (!health.ok) {
    const body = JSON.stringify({ error: "upstream health check failed", details: health });
    return new Response(body, { status: 503, headers: { "content-type": "application/json" } });
  }

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
  };

  const res = await fetch(target.toString(), init);
  const contentType = res.headers.get("content-type") || "text/plain";
  const body = await res.arrayBuffer();

  const responseHeaders: Record<string, string> = { "content-type": contentType };
  const cacheControl = res.headers.get("cache-control");
  if (cacheControl) responseHeaders["cache-control"] = cacheControl;

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
