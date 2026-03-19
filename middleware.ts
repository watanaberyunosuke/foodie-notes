import type { NextRequest } from "next/server";
import { appMiddleware } from "./src/app/middleware";

export function middleware(request: NextRequest) {
  return appMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
