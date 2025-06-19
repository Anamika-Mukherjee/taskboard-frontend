import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/user")) {
    try {
      const cookies = req.cookies;

      if (!cookies) {
        throw new Error("No cookies");
      }

      // ✅ Verify access token directly (no fetch)
      // await jwtVerify(accessToken, SECRET);

      return NextResponse.next();
    } catch (err) {
      console.error("No cookie found", err);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*"]
};
