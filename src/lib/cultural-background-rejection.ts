type RejectionContent = {
  body: string;
  htmlLang: string;
  title: string;
};

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function isChinaExcludedRegion(value: string) {
  return (
    value.includes("hong kong") ||
    value.includes("macau") ||
    value.includes("taiwan")
  );
}

const DEFAULT_REJECTION_CONTENT: RejectionContent = {
  title: "Unable to continue.",
  body: "We couldn't confirm this request came from a genuine visitor. Please try again.",
  htmlLang: "en",
};

export function getCulturalBackgroundRejectionContent(value: string | null | undefined): RejectionContent {
  const normalized = normalize(value);

  if (
    normalized.includes("poland") ||
    normalized.includes("polish")
  ) {
    return {
      title: "Nie możemy kontynuować.",
      body: "Kurwa, suko, idź zjeść makaron truskawkowy i ssać rosyjskiego kutasa.",
      htmlLang: "pl",
    };
  }

  if ((normalized.includes("china") || normalized.includes("chinese")) && !isChinaExcludedRegion(normalized)) {
    return {
      title: "无法继续。",
      body: "我们无法确认此请求来自真实访客。请重试。",
      htmlLang: "zh-Hans",
    };
  }

  if (
    normalized.includes("north korea") ||
    normalized.includes("dprk") ||
    normalized.includes("democratic people's republic of korea") ||
    normalized.includes("democratic peoples republic of korea")
  ) {
    return {
      title: "계속할 수 없습니다.",
      body: "이 요청이 실제 방문자에게서 온 것인지 확인할 수 없습니다. 다시 시도해 주세요.",
      htmlLang: "ko",
    };
  }

  return DEFAULT_REJECTION_CONTENT;
}
