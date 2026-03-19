import { getFoodDrinkItems } from "@/lib/db";
import { ACCESS_VERIFICATION_COOKIE, type VerificationStatus } from "@/middleware/access-control";
import { cookies, headers } from "next/headers";
import FoodDrinkPageClient from "./FoodDrinkPageClient";

export default async function Page() {
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  const items = await getFoodDrinkItems();
  const cachedVerification = cookieStore.get(ACCESS_VERIFICATION_COOKIE)?.value;
  const verificationStatus: VerificationStatus =
    cachedVerification === "granted" || cachedVerification === "rejected"
      ? cachedVerification
      : "pending";

  return (
    <FoodDrinkPageClient
      items={items}
      initialCountryCode={requestHeaders.get("x-vercel-ip-country") ?? requestHeaders.get("cf-ipcountry")}
      initialAcceptLanguage={requestHeaders.get("accept-language")}
      initialVerificationStatus={verificationStatus}
    />
  );
}
