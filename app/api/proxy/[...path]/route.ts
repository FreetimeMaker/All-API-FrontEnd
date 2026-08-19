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
  const url = `${API_BASE}/${path}`;

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() === "host") return;
    headers[key] = value as string;
  });

  const init: RequestInit = {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
  };

  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "text/plain";
  const body = await res.arrayBuffer();

  return new Response(body, {
    status: res.status,
    headers: { "content-type": contentType },
  });
}

export async function GET(req: NextRequest, { params }: any) {
  return forward(req, params.path || "");
}
export async function POST(req: NextRequest, { params }: any) {
  return forward(req, params.path || "");
}
export async function PUT(req: NextRequest, { params }: any) {
  return forward(req, params.path || "");
}
export async function DELETE(req: NextRequest, { params }: any) {
  return forward(req, params.path || "");
}
export async function PATCH(req: NextRequest, { params }: any) {
  return forward(req, params.path || "");
}
