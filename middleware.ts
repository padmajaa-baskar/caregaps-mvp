import { NextRequest, NextResponse } from "next/server";

// Gate the whole app behind Basic Auth. Evaluators get DEMO_USER / DEMO_PASS.
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };

export function middleware(req: NextRequest) {
  const user = process.env.DEMO_USER || "evaluator";
  const pass = process.env.DEMO_PASS || "";
  if (!pass) return NextResponse.next(); // no gate if no password configured

  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const i = decoded.indexOf(":");
      if (i >= 0 && decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) {
        return NextResponse.next();
      }
    } catch {
      /* fall through to challenge */
    }
  }
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="CareGaps CCM demo"' },
  });
}
