import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const restrictedPaths = [
    "/account",
    "/wallet",
    "/dashboard",
    "/userDashboard",
    "/invoices",
    "/mybid",
    "/Mylisting",
  ];

  const isRestricted = restrictedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isRestricted && !token) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("login", "true");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 👇 This enables cookies & applies middleware only to these routes
export const config = {
  matcher: [
    "/account",
    "/wallet",
    "/dashboard",
    "/userDashboard",
    "/invoices",
    "/mybid",
    "/Mylisting",
    "/userDashboard"
  ],
};