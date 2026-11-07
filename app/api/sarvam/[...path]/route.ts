import { NextRequest } from "next/server";

// Transparent reverse proxy: the browser SDK points baseUrl here; we inject the
// Sarvam key server-side so it never reaches the bundle. Only the path suffix is
// client-controlled; the upstream host comes from env (no SSRF).
export const runtime = "nodejs";

const BASE = (process.env.SARVAM_WEBSDK_BASE || "https://apps.sarvam.ai").replace(
  /\/$/,
  "",
);
const KEY = process.env.SARVAM_API_KEY || "";

async function forward(req: NextRequest, path: string[]) {
  const suffix = (path || []).join("/");
  const url = `${BASE}/${suffix}${req.nextUrl.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("authorization"); // strip the demo Basic Auth
  headers.delete("cookie");
  headers.delete("content-length");
  headers.set("x-api-key", KEY);

  const method = req.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : Buffer.from(await req.arrayBuffer());

  const resp = await fetch(url, { method, headers, body, redirect: "manual" });

  const out = new Headers(resp.headers);
  out.delete("content-encoding");
  out.delete("content-length");
  out.delete("transfer-encoding");
  return new Response(resp.body, { status: resp.status, headers: out });
}

type Ctx = { params: Promise<{ path: string[] }> };
export async function GET(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function OPTIONS(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
