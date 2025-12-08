// src/lib/db.ts
import { sql } from "@vercel/postgres";

export type FoodDrinkItem = {
  id: number;
  name: string;
  location: string | null;
  cuisine: string | null;
  website: string | null;
  hats: number | null;
  price_range_per_head: string | null;
  comment: string | null;
};

export async function getFoodDrinkItems(): Promise<FoodDrinkItem[]> {
  // READ ONLY — no create table, no write, no fallback
  const { rows } = await sql<FoodDrinkItem>`
    SELECT
      id,
      name,
      location,
      cuisine,
      website,
      hats,
      price_range_per_head,
      comment,
      city
    FROM food_drink_items
    ORDER BY created_at DESC;
  `;
  return rows;
}
