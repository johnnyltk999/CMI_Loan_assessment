import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isPublicPage = request.nextUrl.pathname === "login" || isLoginPage;
  //   const isPublicPage = request.nextUrl.pathname === "/" || isLoginPage;

  // Redirect to login if no token and trying to access protected page
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if has token and trying to access login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
