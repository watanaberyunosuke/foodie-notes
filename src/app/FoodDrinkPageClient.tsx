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

export default function FoodDrinkPageClient({ items }: Props) {
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
      <div
        className="
          relative
          max-h-[70vh]
          overflow-x-auto
          overflow-y-auto
          rounded-xl
          border border-slate-200 bg-white/90
          shadow-sm
          dark:border-slate-800 dark:bg-slate-900/90
        "
      >
        <table className="min-w-full border-collapse text-sm">
          <thead
            className="
              sticky top-0 z-10
              bg-slate-50/95 dark:bg-slate-800/95
              backdrop-blur
            "
          >
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {[
                "Name",
                "Location",
                "Cuisine",
                "Website",
                "Hats",
                "Price Range Per Head",
                "Comment",
              ].map((col) => (
                <th
                  key={col}
                  className="
                    px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide
                    text-slate-600 dark:text-slate-300
                    whitespace-nowrap
                  "
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((item) => (
              <tr
                key={item.id}
                className="
                  border-t border-slate-100 dark:border-slate-800
                  hover:bg-slate-50/80 dark:hover:bg-slate-800/70
                  align-top
                "
              >
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                  {item.name}
                </td>

                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                  {item.location || ""}
                </td>

                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                  {item.cuisine || item.Cusine || ""}
                </td>

                <td className="px-3 py-2">
                  {item.website ? (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        inline-block
                        max-w-[14rem] sm:max-w-xs
                        truncate
                        text-sky-600 dark:text-sky-400
                        underline-offset-2 hover:underline
                      "
                      title={item.website}
                    >
                      {formatUrlText(item.website)}
                    </a>
                  ) : (
                    <span className="text-slate-700 dark:text-slate-300" />
                  )}
                </td>

                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                  {item.hats ?? item.Hats ?? ""}
                </td>

                <td className="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {item.price_range_per_head ??
                    item["Price Range Per Head"] ??
                    ""}
                </td>

                <td className="px-3 py-2 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {item.comment ?? item.Comment ?? ""}
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
    <main className="h-screen overflow-y-auto bg-[#fbfbfb] dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        {/* Header */}
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 text-4xl">🇦🇺</div>
            <h1 className="text-3xl font-semibold mb-1 text-slate-900 dark:text-slate-100">
              Australia – Food &amp; Drink List
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Read-only view backed by <code>food_drink_items</code> in Postgres.
              Each city is shown as a separate table.
            </p>
          </div>

          <div className="mt-1">
            <ThemeToggle />
          </div>
        </header>

        {/* Layout: TOC + content */}
        <div className="flex gap-8">
          {/* TOC sidebar – always visible, on the left */}
          <aside className="w-52 shrink-0">
            <div className="sticky top-24 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Cities
              </h2>
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleScrollTo(item.id)}
                    className="
                      w-full text-left text-sm
                      rounded-md px-2.5 py-1.5
                      text-slate-700 dark:text-slate-200
                      hover:bg-slate-100 dark:hover:bg-slate-800
                      transition
                    "
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{item.label}</span>
                      <span className="text-[0.7rem] font-mono text-slate-400 dark:text-slate-500">
                        {item.count || 0}
                      </span>
                    </div>
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
