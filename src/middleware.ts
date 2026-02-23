import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_session";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLoggedIn = request.cookies.get(ADMIN_COOKIE)?.value === "1";

  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(
      new URL(isLoggedIn ? "/admin/products" : "/admin/login", request.url)
    );
  }

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/products", request.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
