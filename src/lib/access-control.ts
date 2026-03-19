const VERIFIED_BACKGROUND_TOKENS = [
  "poland",
  "polish",
  "mainland china",
  "china",
  "chinese",
  "simplified chinese",
  "north korea",
  "north korean",
  "dprk",
  "democratic people's republic of korea",
  "democratic peoples republic of korea",
];
const BLOCKED_COUNTRY_CODES = new Set(["PL", "CN", "KP"]);
const BLOCKED_LANGUAGE_PREFIXES = ["pl", "zh", "zh-cn", "ko-kp"];

export const ACCESS_VERIFICATION_COOKIE = "foodie-notes-access-verification";

export type VerificationStatus = "pending" | "granted" | "rejected";

type MaybeString = string | null | undefined;

function normalize(value: MaybeString) {
  return value?.trim().toLowerCase() ?? "";
}

function matchesToken(value: MaybeString, tokens: string[]) {
  const normalized = normalize(value);
  return normalized.length > 0 && tokens.some((token) => normalized.includes(token));
}

export function isAllowedVerifiedBackground(value: MaybeString) {
  return matchesToken(value, VERIFIED_BACKGROUND_TOKENS);
}

export function isBlockedCountryCode(value: MaybeString) {
  const normalized = normalize(value).toUpperCase();
  return normalized ? BLOCKED_COUNTRY_CODES.has(normalized) : false;
}

export function isBlockedLanguage(value: MaybeString) {
  const normalized = normalize(value);
  if (!normalized) return false;

  return normalized
    .split(",")
    .map((entry) => entry.split(";")[0]?.trim())
    .filter(Boolean)
    .some((entry) =>
      BLOCKED_LANGUAGE_PREFIXES.some(
        (blockedPrefix) => entry === blockedPrefix || entry.startsWith(`${blockedPrefix}-`),
      ),
    );
}

export function shouldRejectRequest(headers: Headers) {
  const countryHeaders = [
    headers.get("x-vercel-ip-country"),
    headers.get("cf-ipcountry"),
    headers.get("x-country-code"),
    headers.get("x-country"),
    headers.get("x-user-country"),
    headers.get("x-geo-country"),
    headers.get("x-forwarded-country"),
  ];

  const languageHeaders = [
    headers.get("accept-language"),
    headers.get("x-user-language"),
    headers.get("x-user-locale"),
    headers.get("x-forwarded-language"),
  ];

  return countryHeaders.some(isBlockedCountryCode) || languageHeaders.some(isBlockedLanguage);
}
