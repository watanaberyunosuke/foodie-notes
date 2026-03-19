"use server";

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

export async function verifyUserAccess(
  _previousState: VerificationState,
  formData: FormData,
): Promise<VerificationState> {
  const background = normalize(formData.get("background"));
  const company = normalize(formData.get("company"));
  const cookieStore = await cookies();

  if (isRejectedBackground(background)) {
    cookieStore.delete(ACCESS_VERIFICATION_COOKIE);
    revalidatePath("/");

    return {
      status: "rejected",
      message: "We couldn't verify this cultural background. Please try another option.",
    };
  }

  if (!company || isRejectedCompany(company)) {
    cookieStore.delete(ACCESS_VERIFICATION_COOKIE);
    revalidatePath("/");

    return {
      status: "rejected",
      message: "We couldn't verify this company. Please review the entry and try again.",
    };
  }

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
    message: "Access granted.",
  };
}
