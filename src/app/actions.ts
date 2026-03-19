"use server";

import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  ACCESS_VERIFICATION_COOKIE,
  isRejectedBackground,
  isRejectedCompany,
  type VerificationStatus,
} from "@/middleware/access-control";

export type VerificationState = {
  message: string;
  status: VerificationStatus;
};

function normalize(value: string | FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function clearAccessCookie(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  cookieStore.delete(ACCESS_VERIFICATION_COOKIE);
}

function grantAccessCookie(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  cookieStore.set(ACCESS_VERIFICATION_COOKIE, "granted", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

function matchesBypassPassword(input: string, expected: string) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputBuffer, expectedBuffer);
}

export async function verifyUserAccess(
  _previousState: VerificationState,
  formData: FormData,
): Promise<VerificationState> {
  const background = normalize(formData.get("background"));
  const company = normalize(formData.get("company"));
  const cookieStore = await cookies();

  if (isRejectedBackground(background)) {
    clearAccessCookie(cookieStore);
    revalidatePath("/");

    return {
      status: "rejected",
      message: "We couldn't confirm this request came from a genuine visitor. Please try again.",
    };
  }

  if (!company || isRejectedCompany(company)) {
    clearAccessCookie(cookieStore);
    revalidatePath("/");

    return {
      status: "rejected",
      message: "We couldn't confirm this request came from a genuine visitor. Please try again.",
    };
  }

  grantAccessCookie(cookieStore);
  revalidatePath("/");

  return {
    status: "granted",
    message: "Access granted.",
  };
}

export async function verifyPasswordBypass(
  _previousState: VerificationState,
  formData: FormData,
): Promise<VerificationState> {
  const password = normalize(formData.get("password"));
  const bypassPassword = normalize(process.env.ACCESS_BYPASS_PASSWORD ?? null);
  const cookieStore = await cookies();

  if (!password || !bypassPassword || !matchesBypassPassword(password, bypassPassword)) {
    clearAccessCookie(cookieStore);
    revalidatePath("/");

    return {
      status: "rejected",
      message: "We couldn't verify the access code. Please try again.",
    };
  }

  grantAccessCookie(cookieStore);
  revalidatePath("/");

  return {
    status: "granted",
    message: "Access granted.",
  };
}
