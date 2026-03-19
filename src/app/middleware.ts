import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function appMiddleware(request: NextRequest) {
  void request;
  // Let the gate page render so a valid access code can bypass the checks.
  return NextResponse.next();
}

export const middlewareConfig = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
