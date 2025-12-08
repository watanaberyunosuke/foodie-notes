// src/app/page.tsx
import { getFoodDrinkItems } from "@/lib/db";

export default async function Page() {
  // Define a local type for the rows returned by getFoodDrinkItems (so we don't use `any`)
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
  };

  const items = (await getFoodDrinkItems()) as FoodDrinkItem[];

  const melbourne = items.filter((i) => i.city === "Melbourne");
  const sydney = items.filter((i) => (i.city ?? "").toLowerCase() === "sydney");
  const adelaide = items.filter(
    (i) => i.city === "Adelaide" || i.city === "Adelaide SA"
  );

  const renderTable = (rows: any[]) => {
    if (!rows.length) {
      return (
        <p className="text-sm text-slate-500">
          No rows found in <code>food_drink_items</code> for this city.
        </p>
      );
    }

    return (
      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white text-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-3 py-2 text-left font-medium text-slate-600">
                Name
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-600">
                Location
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-600">
                Cusine
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-600">
                Website
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-600">
                Hats
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-600 whitespace-nowrap">
                Price Range Per Head
              </th>
              <th className="px-3 py-2 text-left font-medium text-slate-600">
                Comment
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-100 align-top"
              >
                <td className="px-3 py-2 font-medium text-slate-900">
                  {item.name}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {item.location || ""}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {item.cuisine || item.Cusine || ""}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {item.website ? (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-600 underline-offset-2 hover:underline break-all"
                    >
                      {item.website}
                    </a>
                  ) : (
                    ""
                  )}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {item.hats ?? item.Hats ?? ""}
                </td>
                <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                  {item.price_range_per_head ??
                    item["Price Range Per Head"] ??
                    ""}
                </td>
                <td className="px-3 py-2 text-slate-700 whitespace-pre-wrap">
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
    <main className="min-h-screen bg-[#fbfbfb]">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        {/* Header */}
        <header className="mb-4">
          <div className="mb-3 text-4xl">🇦🇺</div>
          <h1 className="text-3xl font-semibold mb-1">
            Australia – Food &amp; Drink List
          </h1>
          <p className="text-sm text-slate-500">
            Read-only view backed by <code>food_drink_items</code>{" "}
            in Postgres. Each city is shown as a separate table.
          </p>
        </header>

        {/* Melbourne table */}
        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold">Melbourne / Victoria</h2>
            <p className="text-sm text-slate-500">
              Data filtered where <code>city = &quot;Melbourne&quot;</code>.
            </p>
          </div>
          {renderTable(melbourne)}
        </section>

        {/* Sydney table */}
        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold">Sydney / NSW</h2>
            <p className="text-sm text-slate-500">
              Data filtered where <code>city = &quot;Sydney&quot;</code>.
            </p>
          </div>
          {renderTable(sydney)}
        </section>

        {/* Adelaide table */}
        <section className="space-y-3 pb-12">
          <div>
            <h2 className="text-xl font-semibold">Adelaide / SA</h2>
            <p className="text-sm text-slate-500">
              Data filtered where <code>city = &quot;Adelaide&quot;</code> or{" "}
              <code>&quot;Adelaide SA&quot;</code>.
            </p>
          </div>
          {renderTable(adelaide)}
        </section>
      </div>
    </main>
  );
}
