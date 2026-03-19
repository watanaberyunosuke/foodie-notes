import type { NextRequest } from "next/server";
import { appMiddleware, middlewareConfig } from "./src/app/middleware";

export function middleware(request: NextRequest) {
  return appMiddleware(request);
}

export const config = middlewareConfig;
