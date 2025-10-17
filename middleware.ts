import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = [
  "/home",
  "/register",
  "/parrainer",
  "/user",
  "/update",
  "/recherche-intelligente",
  "/update-user/:path*",
  "/auth/parrainer",
  "/scanner",
  "/admin",
  "/referent/dashboard",
];
const publicRoutes = ["/", "/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === "/user") {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route.replace(":path*", ""))
  );
  const isPublicRoute = publicRoutes.includes(path);

  if (sessionCookie && isPublicRoute) {
    return NextResponse.redirect(new URL("/user", request.url));
  }

  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
