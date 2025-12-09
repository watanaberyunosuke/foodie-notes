import { getFoodDrinkItems } from "@/lib/db";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Page() {
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

  const items = (await getFoodDrinkItems()) as FoodDrinkItem[];

  const melbourne = items.filter((i) => i.city === "Melbourne");
  const sydney = items.filter((i) => (i.city ?? "").toLowerCase() === "sydney");
  const adelaide = items.filter(
    (i) => i.city === "Adelaide" || i.city === "Adelaide SA"
  );

  const formatUrlText = (url: string) => {
    if (!url) return "";
    // strip protocol and trailing slash for display
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
          overflow-auto
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
                      title={item.website} // full URL on hover
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

  return (
    <main className="min-h-screen bg-[#fbfbfb] dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        {/* Header with top-right toggle */}
        <header className="mb-4 flex items-start justify-between gap-4">
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

        {/* Melbourne card */}
        <section>
          <div
            className="
              space-y-3
              rounded-2xl
              border border-slate-200/80 bg-white/90
              shadow-md
              dark:border-slate-800/80 dark:bg-slate-900/90
              p-4 sm:p-6
            "
          >
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Melbourne / Victoria
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Data where <code>city = &quot;Melbourne&quot;</code>.
              </p>
            </div>
            {renderTable(melbourne)}
          </div>
        </section>

        {/* Sydney card */}
        <section>
          <div
            className="
              space-y-3
              rounded-2xl
              border border-slate-200/80 bg-white/90
              shadow-md
              dark:border-slate-800/80 dark:bg-slate-900/90
              p-4 sm:p-6
            "
          >
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Sydney / NSW
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Data where <code>city = &quot;Sydney&quot;</code>.
              </p>
            </div>
            {renderTable(sydney)}
          </div>
        </section>

        {/* Adelaide card */}
        <section className="pb-12">
          <div
            className="
              space-y-3
              rounded-2xl
              border border-slate-200/80 bg-white/90
              shadow-md
              dark:border-slate-800/80 dark:bg-slate-900/90
              p-4 sm:p-6
            "
          >
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Adelaide / SA
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Data where <code>city = &quot;Adelaide&quot;</code> or{" "}
                <code>&quot;Adelaide SA&quot;</code>.
              </p>
            </div>
            {renderTable(adelaide)}
          </div>
        </section>
      </div>
    </main>
  );
}
