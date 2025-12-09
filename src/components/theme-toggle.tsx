"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm 
        bg-white/80 dark:bg-slate-900/80
        border-slate-300 dark:border-slate-700
        shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800
        transition
      "
      aria-label="Toggle dark mode"
    >
      <span className="text-lg">{isDark ? "🌙" : "☀️"}</span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
