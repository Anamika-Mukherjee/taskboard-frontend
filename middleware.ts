import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkTokenApi } from "./services/auth/checkToken";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/user")) {
    try {
      const cookies = req.cookies;

      if (!cookies) {
        throw new Error("No cookies");
      }

      return NextResponse.next();
    } 
    catch (err) {
      console.error("No cookie found", err);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*"]
};
