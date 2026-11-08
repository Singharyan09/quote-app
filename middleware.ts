import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const h = req.headers.get("authorization");
  if (h?.startsWith("Basic ")) {
    const [user, ...rest] = atob(h.slice(6)).split(":");
    if (user === process.env.ADMIN_USER && rest.join(":") === process.env.ADMIN_PASSWORD)
      return NextResponse.next();
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}
export const config = { matcher: ["/admin/:path*"] };
