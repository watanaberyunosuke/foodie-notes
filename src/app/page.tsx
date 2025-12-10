// src/app/page.tsx
import { getFoodDrinkItems } from "@/lib/db";
import FoodDrinkPageClient from "./FoodDrinkPageClient";

export default async function Page() {
  const items = (await getFoodDrinkItems()) as any[];
  return <FoodDrinkPageClient items={items} />;
}
