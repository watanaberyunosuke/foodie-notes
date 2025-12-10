// src/components/ToggleSection.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

type ToggleSectionProps = {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

export function ToggleSection({
  id,
  title,
  description,
  children,
}: ToggleSectionProps) {
  const storageKey = `foodienotes-toggle-${id}`;
  const [open, setOpen] = useState(true);

  // Load persisted state
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "0") setOpen(false);
    if (stored === "1") setOpen(true);
  }, [storageKey]);

  // Save state
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, open ? "1" : "0");
    }
  }, [open, storageKey]);

  return (
    <section
      className="
        rounded-2xl border border-slate-200/80 bg-white/90 shadow-md
        dark:border-slate-800/80 dark:bg-slate-900/90
        p-4 sm:p-6 space-y-3
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        {/* Title + description */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {description}
        </div>

        {/* Arrow toggle */}
        <IconButton
          onClick={() => setOpen((o) => !o)}
          size="small"
          aria-label="toggle section"
          sx={{
            transition: "transform 0.3s ease",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            color: "var(--mui-palette-text-primary, #94a3b8)",
          }}
        >
          <KeyboardArrowRightIcon fontSize="medium" />
        </IconButton>
      </div>

      {/* Animated expand/collapse */}
      <div
        className={`
          grid transition-all duration-300 ease-out
          ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </section>
  );
}
