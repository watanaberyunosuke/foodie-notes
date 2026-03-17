// src/app/FoodDrinkPageClient.tsx
"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { ToggleSection } from "@/components/ToggleSection";

type FoodDrinkItem = {
  id: string | number;
  name: string;
  city?: string;
  location?: string;
  cuisine?: string;
  website?: string;
  hats?: string | number;
  price_range_per_head?: string;
  comment?: string;
  // allow raw CSV keys too
  Cusine?: string;
  Hats?: string | number;
  Comment?: string;
  "Price Range Per Head"?: string;
};

type Props = {
  items: FoodDrinkItem[];
};

export default function FoodDrinkPageClient({ items }: Readonly<Props>) {
  const melbourne = items.filter((i) => i.city === "Melbourne");
  const sydney = items.filter((i) => (i.city ?? "").toLowerCase() === "sydney");
  const adelaide = items.filter(
    (i) => i.city === "Adelaide" || i.city === "Adelaide SA"
  );

  const formatUrlText = (url: string) => {
    if (!url) return "";
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  };

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
              {[
                "Name",
                "Location",
                "Cuisine",
                "Website",
                "Hats",
                "Price",
                "Notes",
              ].map((col) => (
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
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-neutral-100 min-w-48">
                  {item.name}
                </td>

                <td className="px-4 py-3 text-slate-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    {item.location || "—"}
                  </div>
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
                  {(item.hats ?? item.Hats) ? (
                    <span className="font-semibold text-slate-700 dark:text-neutral-300">
                      {item.hats ?? item.Hats} Hats
                    </span>
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

  // Table of contents entries
  const tocItems = [
    { id: "melbourne", label: "Melbourne / Victoria", count: melbourne.length },
    { id: "sydney", label: "Sydney / NSW", count: sydney.length },
    { id: "adelaide", label: "Adelaide / SA", count: adelaide.length },
  ];

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-12 relative z-10">
        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 minimal-card rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-neutral-800 px-3 py-1 text-xs font-semibold text-slate-800 dark:text-neutral-200 ring-1 ring-inset ring-slate-200 dark:ring-neutral-700">
                Curated Selection
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 pb-1">
              Food &amp; Drink Notes
            </h1>
            <p className="text-base text-slate-600 dark:text-neutral-400 max-w-xl">
              A carefully maintained list of the best places across Australia. Powered by <strong>Postgres</strong>.
            </p>
          </div>

          <div className="sm:pb-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Layout: TOC + content */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* TOC sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-8 space-y-6 minimal-card rounded-3xl p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-neutral-500 pl-2">
                Destinations
              </h2>
              <nav className="space-y-1.5 flex flex-col">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleScrollTo(item.id)}
                    className="group relative w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="relative z-10 inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 text-xs font-medium text-slate-500 dark:text-neutral-400 group-hover:bg-slate-200 group-hover:text-slate-700 dark:group-hover:bg-neutral-700 dark:group-hover:text-neutral-300 transition-colors border border-transparent dark:border-neutral-700/50">
                      {item.count || 0}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content: sections on the right */}
          <div className="flex-1 space-y-8">
            <ToggleSection
              id="melbourne"
              title="Melbourne / Victoria"
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
              description={
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Data where <code>city = &quot;Adelaide&quot;</code> or{" "}
                  <code>&quot;Adelaide SA&quot;</code>.
                </p>
              }
            >
              {renderTable(adelaide)}
            </ToggleSection>
          </div>
        </div>
      </div>
    </main>
  );

}
