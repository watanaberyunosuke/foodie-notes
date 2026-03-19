import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { shouldRejectRequest } from "@/lib/access-control";

export function middleware(request: NextRequest) {
  if (shouldRejectRequest(request.headers)) {
    return new NextResponse("Entry rejected.", {
      status: 403,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
