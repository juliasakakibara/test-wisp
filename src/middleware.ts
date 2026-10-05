import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Lets root layout skip public chrome on /admin/* routes */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
