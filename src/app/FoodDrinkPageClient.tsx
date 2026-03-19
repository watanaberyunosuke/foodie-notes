// src/app/FoodDrinkPageClient.tsx
"use client";

import { verifyUserAccess, type VerificationState } from "./actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { ToggleSection } from "@/components/ToggleSection";
import { COUNTRY_OPTIONS } from "@/lib/countries";
import {
  isBlockedCountryCode,
  isBlockedLanguage,
  isRejectedBackground,
  isRejectedCompany,
  type VerificationStatus,
} from "@/middleware/access-control";
import { useActionState, useMemo, useState } from "react";

type FoodDrinkItem = {
  id: string | number;
  name: string;
  city?: string;
  location?: string | null;
  cuisine?: string | null;
  website?: string | null;
  hats?: string | number | null;
  price_range_per_head?: string | null;
  comment?: string | null;
  Cusine?: string;
  Hats?: string | number;
  Comment?: string;
  "Price Range Per Head"?: string;
};

type Props = {
  items: FoodDrinkItem[];
  initialCountryCode?: string | null;
  initialAcceptLanguage?: string | null;
  initialVerificationStatus: VerificationStatus;
};

function getInitialVerificationState(status: VerificationStatus): VerificationState {
  if (status === "granted") {
    return { status, message: "Access granted." };
  }

  if (status === "rejected") {
    return { status: "pending", message: "" };
  }

  return { status: "pending", message: "" };
}

export default function FoodDrinkPageClient({
  items,
  initialCountryCode,
  initialAcceptLanguage,
  initialVerificationStatus,
}: Readonly<Props>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [verificationStep, setVerificationStep] = useState<"background" | "company">("background");
  const [selectedBackground, setSelectedBackground] = useState("");
  const [company, setCompany] = useState("");
  const [localRejectionMessage, setLocalRejectionMessage] = useState("");
  const [hideServerRejectionMessage, setHideServerRejectionMessage] = useState(false);
  const initialVerificationState = getInitialVerificationState(initialVerificationStatus);
  const [verificationState, formAction, isPending] = useActionState(
    verifyUserAccess,
    initialVerificationState,
  );
  const isTechnicallyRejected =
    isBlockedCountryCode(initialCountryCode) || isBlockedLanguage(initialAcceptLanguage);
  const accessGranted = !isTechnicallyRejected && verificationState.status === "granted";
  const rejectionMessage = "Access is unavailable.";
  const serverRejectionMessage =
    verificationState.status === "rejected" && !hideServerRejectionMessage
      ? verificationState.message
      : "";
  const visibleStepRejectionMessage = localRejectionMessage || serverRejectionMessage;

  const handleSectionToggle = (id: string, isOpen: boolean) => {
    setExpandedSections((prev) => ({ ...prev, [id]: isOpen }));
  };
  const isAnySectionExpanded = Object.values(expandedSections).some(Boolean);

  const uniqueCuisines = Array.from(
    new Set(
      items
        .map((i) => (i.cuisine || i.Cusine || "").trim())
        .filter((c) => c !== "" && c !== "—"),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const filteredItems = items.filter((item) => {
    const itemCuisine = (item.cuisine || item.Cusine || "").trim();
    const matchesCuisine = !cuisineFilter || itemCuisine === cuisineFilter;

    if (!matchesCuisine) return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = (item.name || "").toLowerCase();
    const loc = (item.location || "").toLowerCase();
    const note = (item.comment || item.Comment || "").toLowerCase();

    return name.includes(q) || loc.includes(q) || note.includes(q);
  });

  const melbourne = filteredItems.filter((i) => i.city === "Melbourne");
  const sydney = filteredItems.filter((i) => (i.city ?? "").toLowerCase() === "sydney");
  const adelaide = filteredItems.filter((i) => i.city === "Adelaide" || i.city === "Adelaide SA");

  const tocItems = useMemo(
    () => [
      { id: "melbourne", label: "Melbourne / Victoria", count: melbourne.length },
      { id: "sydney", label: "Sydney / NSW", count: sydney.length },
      { id: "adelaide", label: "Adelaide / SA", count: adelaide.length },
    ],
    [adelaide.length, melbourne.length, sydney.length],
  );

  const formatUrlText = (url: string) => {
    if (!url) return "";
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBackgroundChange = (value: string) => {
    setSelectedBackground(value);
    setLocalRejectionMessage("");
    setHideServerRejectionMessage(true);
  };

  const handleCompanyChange = (value: string) => {
    setCompany(value);
    setLocalRejectionMessage("");
    setHideServerRejectionMessage(true);
  };

  const handleBackgroundContinue = () => {
    if (!selectedBackground) {
      return;
    }

    if (isRejectedBackground(selectedBackground)) {
      setLocalRejectionMessage("Cultural background rejected.");
      setHideServerRejectionMessage(true);
      return;
    }

    setLocalRejectionMessage("");
    setHideServerRejectionMessage(true);
    setVerificationStep("company");
  };

  const handleBackToBackground = () => {
    setVerificationStep("background");
    setLocalRejectionMessage("");
    setHideServerRejectionMessage(true);
  };

  const handleCompanySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (isRejectedCompany(company)) {
      event.preventDefault();
      setLocalRejectionMessage("Company rejected.");
      setHideServerRejectionMessage(true);
      return;
    }

    setLocalRejectionMessage("");
    setHideServerRejectionMessage(false);
  };

  if (!accessGranted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 dark:bg-neutral-950">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-neutral-900">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-neutral-500">
                Private access
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Access required</h1>
            </div>
            <ThemeToggle />
          </div>

          {isTechnicallyRejected ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
              <p className="font-semibold">Access unavailable.</p>
              <p className="mt-2 text-sm">{rejectionMessage}</p>
            </div>
          ) : (
            <div className="space-y-5">
              {visibleStepRejectionMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                  <p className="font-semibold">Rejected.</p>
                  <p className="mt-2 text-sm">{visibleStepRejectionMessage}</p>
                </div>
              ) : null}

              {verificationStep === "background" ? (
                <>
                  <p className="text-sm leading-6 text-slate-600 dark:text-neutral-300">
                    Step 1 of 2. Select your cultural background to continue.
                  </p>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-neutral-200">Cultural background</span>
                    <select
                      name="background"
                      required
                      value={selectedBackground}
                      onChange={(event) => handleBackgroundChange(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      {COUNTRY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    disabled={!selectedBackground}
                    onClick={handleBackgroundContinue}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Continue
                  </button>
                </>
              ) : (
                <form action={formAction} onSubmit={handleCompanySubmit} className="space-y-5">
                  <input type="hidden" name="background" value={selectedBackground} />

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-neutral-400">
                      Step 1 complete
                    </p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-neutral-200">{selectedBackground}</p>
                  </div>

                  <p className="text-sm leading-6 text-slate-600 dark:text-neutral-300">
                    Step 2 of 2. Enter your company to continue.
                  </p>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-neutral-200">Company</span>
                    <input
                      name="company"
                      type="text"
                      required
                      value={company}
                      onChange={(event) => handleCompanyChange(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      placeholder="Enter company"
                    />
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBackToBackground}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isPending || !company.trim()}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      {isPending ? "Verifying…" : "Verify and continue"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderTable = (rows: FoodDrinkItem[]) => {
    if (!rows.length) {
      return (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No rows found in <code>food_drink_items</code> for this city.
        </p>
      );
    }

    return (
      <div className="relative overflow-x-auto rounded-xl minimal-card">
        <table className="min-w-full border-collapse text-sm text-left">
          <thead className="border-b border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50">
            <tr>
              {["Name", "Location", "Cuisine", "Website", "Hats", "Price", "Notes"].map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
            {rows.map((item) => (
              <tr
                key={item.id}
                className="group align-top hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors duration-200"
              >
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-neutral-100 min-w-48">{item.name}</td>

                <td className="px-4 py-3 text-slate-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5">{item.location || "—"}</div>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-neutral-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700">
                    {item.cuisine || item.Cusine || "—"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {item.website ? (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 max-w-48 truncate font-medium underline-offset-4 decoration-slate-300 hover:decoration-cyan-500 dark:decoration-neutral-600 text-slate-700 hover:text-cyan-700 dark:text-neutral-300"
                      title={item.website}
                    >
                      {formatUrlText(item.website)}
                    </a>
                  ) : (
                    <span className="text-slate-400 dark:text-neutral-500">—</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  {item.hats ?? item.Hats ? (
                    <span className="font-semibold text-slate-700 dark:text-neutral-300">{item.hats ?? item.Hats} Hats</span>
                  ) : (
                    <span className="text-slate-400 dark:text-neutral-500">—</span>
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-700 dark:text-neutral-300">
                  {item.price_range_per_head ?? item["Price Range Per Head"] ?? "—"}
                </td>

                <td className="px-4 py-3 text-slate-600 dark:text-neutral-400 whitespace-pre-wrap text-sm leading-relaxed max-w-sm">
                  {item.comment ?? item.Comment ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-transparent font-sans selection:bg-cyan-200 selection:text-cyan-900 dark:selection:bg-cyan-900 dark:selection:text-cyan-100">
      <aside
        className={`sticky top-0 h-screen shrink-0 border-r border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-3xl transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col z-20 ${
          isAnySectionExpanded
            ? "w-0 opacity-0 -translate-x-8 overflow-hidden"
            : "w-[280px] opacity-100 translate-x-0 overflow-y-auto"
        }`}
      >
        <div className="flex flex-col h-full p-8">
          <nav className="space-y-3 flex flex-col mt-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-neutral-500 mb-4 pl-3">
              Destinations
            </h2>
            {tocItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleScrollTo(item.id)}
                className="group relative w-full flex items-center justify-between rounded-3xl px-4 py-3.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:ring-1 hover:ring-black/5 dark:hover:ring-white/10 dark:text-neutral-300 text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">{item.label}</span>
                <span className="relative z-10 inline-flex items-center justify-center rounded-full bg-slate-200/50 dark:bg-black/20 shadow-sm px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-neutral-400 transition-colors border border-transparent dark:border-white/5 group-hover:bg-white group-hover:text-slate-900 dark:group-hover:bg-white/20 dark:group-hover:text-white">
                  {item.count || 0}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main
        className={`flex-1 w-full min-w-0 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10 ${
          isAnySectionExpanded ? "max-w-7xl mx-auto" : ""
        }`}
      >
        <div className="mx-auto max-w-5xl px-6 sm:px-12 py-16 sm:py-24 space-y-16">
          <header className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-white/80 dark:bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-neutral-200 ring-1 ring-inset ring-slate-200/50 dark:ring-white/10 shadow-sm backdrop-blur-md">
                  Curated Selection
                </span>
                <ThemeToggle />
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight pb-2 bg-clip-text text-transparent bg-linear-to-br from-slate-900 to-slate-500 dark:from-white dark:to-neutral-400">
                Food &amp; Drink Notes
              </h1>
              <p className="text-lg text-slate-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                A carefully maintained list of the best places across Australia. Powered by <strong>Postgres</strong>.
              </p>
            </div>
          </header>

          <div className="flex flex-col sm:flex-row gap-5 relative z-10 w-full mb-10">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-transform group-focus-within:scale-110 group-focus-within:text-cyan-500">
                <svg className="w-5 h-5 text-slate-400 dark:text-neutral-500 transition-colors group-focus-within:text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, location, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-4xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md py-4 pl-12 pr-6 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 outline-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300"
              />
            </div>
            <div className="sm:w-72 shrink-0 relative group">
              <select
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
                className="w-full rounded-4xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md py-4 pl-6 pr-12 text-base text-slate-900 dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 outline-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] appearance-none cursor-pointer transition-all duration-300"
              >
                <option value="">All Cuisines</option>
                {uniqueCuisines.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none transition-transform group-focus-within:rotate-180">
                <svg className="w-5 h-5 text-slate-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <ToggleSection
              id="melbourne"
              title="Melbourne / Victoria"
              onToggle={(isOpen) => handleSectionToggle("melbourne", isOpen)}
              description={
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Data where <code>city = &quot;Melbourne&quot;</code>.
                </p>
              }
            >
              {renderTable(melbourne)}
            </ToggleSection>

            <ToggleSection
              id="sydney"
              title="Sydney / NSW"
              onToggle={(isOpen) => handleSectionToggle("sydney", isOpen)}
              description={
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Data where <code>city = &quot;Sydney&quot;</code>.
                </p>
              }
            >
              {renderTable(sydney)}
            </ToggleSection>

            <ToggleSection
              id="adelaide"
              title="Adelaide / SA"
              onToggle={(isOpen) => handleSectionToggle("adelaide", isOpen)}
              description={
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Data where <code>city = &quot;Adelaide&quot;</code> or <code>&quot;Adelaide SA&quot;</code>.
                </p>
              }
            >
              {renderTable(adelaide)}
            </ToggleSection>
          </div>
        </div>
      </main>
    </div>
  );
}
