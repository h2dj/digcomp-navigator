import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicAdminPaths = new Set([
    "/admin/login",
    "/api/admin/login",
    "/admin/forgot-password",
    "/api/admin/password/forgot",
    "/admin/reset-password",
    "/api/admin/password/reset",
  ]);

  if (publicAdminPaths.has(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const session = await getAdminSessionFromRequest(request);
    if (!session) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
      }

      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
