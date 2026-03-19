"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  ACCESS_VERIFICATION_COOKIE,
  isAllowedVerifiedBackground,
  type VerificationStatus,
} from "@/middleware/access-control";

export type VerificationState = {
  message: string;
  status: VerificationStatus;
};

export async function verifyUserAccess(
  _previousState: VerificationState,
  formData: FormData,
): Promise<VerificationState> {
  const background = formData.get("background");
  const cookieStore = await cookies();

  if (typeof background === "string" && isAllowedVerifiedBackground(background)) {
    cookieStore.set(ACCESS_VERIFICATION_COOKIE, "granted", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    revalidatePath("/");

    return {
      status: "granted",
      message: "Verification passed. Access granted.",
    };
  }

  cookieStore.set(ACCESS_VERIFICATION_COOKIE, "rejected", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  revalidatePath("/");

  return {
    status: "rejected",
    message: "Verification failed. Only listed countries or cultural backgrounds can pass.",
  };
}
