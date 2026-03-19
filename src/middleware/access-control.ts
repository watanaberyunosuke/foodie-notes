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

function getPrimaryLanguageTag(value: MaybeString) {
  return normalize(value)
    .split(",")[0]
    ?.split(";")[0]
    ?.trim() ?? "";
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
  const primaryLanguageTag = getPrimaryLanguageTag(value);
  if (!primaryLanguageTag) return false;

  return BLOCKED_LANGUAGE_PREFIXES.some(
    (blockedPrefix) =>
      primaryLanguageTag === blockedPrefix || primaryLanguageTag.startsWith(`${blockedPrefix}-`),
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
