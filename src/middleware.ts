import { NextRequest, NextResponse } from "next/server";
import { authenticatedRoutes, unauthenticatedRoutes } from './constants/routes';
import { isAuthenticated } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isUserAuthenticated = await isAuthenticated();

  // kalau user tidak terautentikasi dan user ingin mengakses protected route, redirect user ke signin
  if (
    !isUserAuthenticated &&
    authenticatedRoutes.some((route: { title: string, path: string }) => pathname.startsWith(route.path))
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // kalau user sudah terautentikasi dan user ingin mengakses unauthenticated routes, redirect user ke dashboard
  if (
    isUserAuthenticated &&
    unauthenticatedRoutes.some((route: { title: string, path: string }) => pathname.startsWith(route.path))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signup", "/signin"]
};