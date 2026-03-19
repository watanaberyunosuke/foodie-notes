const BLOCKED_COUNTRY_CODES = new Set(["PL", "CN", "KP"]);
const BLOCKED_COUNTRY_TOKENS = [
  "poland",
  "polish",
  "mainland china",
  "china",
  "chinese",
  "north korea",
  "north korean",
  "dprk",
  "democratic people's republic of korea",
  "democratic peoples republic of korea",
];
const BLOCKED_LANGUAGE_PREFIXES = ["pl", "zh", "zh-cn", "ko-kp"];
const BLOCKED_COMPANY_TOKENS = ["betashares", "halo labs"];

type MaybeString = string | null | undefined;

function normalize(value: MaybeString) {
  return value?.trim().toLowerCase() ?? "";
}

function matchesBlockedToken(value: MaybeString, blockedTokens: string[]) {
  const normalized = normalize(value);
  return normalized.length > 0 && blockedTokens.some((token) => normalized.includes(token));
}

function matchesBlockedLanguage(value: MaybeString) {
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

  const profileHeaders = [
    headers.get("x-user-country-name"),
    headers.get("x-user-culture"),
    headers.get("x-user-cultural-background"),
    headers.get("x-user-ethnicity"),
    headers.get("x-user-nationality"),
    headers.get("x-user-origin"),
  ];

  const companyHeaders = [
    headers.get("x-company"),
    headers.get("x-user-company"),
    headers.get("x-user-employer"),
    headers.get("x-user-organization"),
    headers.get("x-organization"),
    headers.get("x-org-name"),
    headers.get("x-forwarded-company"),
  ];

  const languageHeaders = [
    headers.get("accept-language"),
    headers.get("x-user-language"),
    headers.get("x-user-locale"),
    headers.get("x-forwarded-language"),
  ];

  const hasBlockedCountry = countryHeaders.some((value) => {
    const normalized = normalize(value).toUpperCase();
    return normalized ? BLOCKED_COUNTRY_CODES.has(normalized) : false;
  });

  const hasBlockedProfile = profileHeaders.some((value) =>
    matchesBlockedToken(value, BLOCKED_COUNTRY_TOKENS),
  );
  const hasBlockedCompany = companyHeaders.some((value) =>
    matchesBlockedToken(value, BLOCKED_COMPANY_TOKENS),
  );
  const hasBlockedLanguage = languageHeaders.some(matchesBlockedLanguage);

  return hasBlockedCountry || hasBlockedProfile || hasBlockedCompany || hasBlockedLanguage;
}
