// src/components/ToggleSection.tsx
"use client";

import { useState, ReactNode } from "react";

type ToggleSectionProps = {
  id: string;              // now required, used for anchor + TOC
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
  // always start folded
  const [open, setOpen] = useState(false);

  return (
    <section
      id={id}
      className="space-y-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-md dark:border-slate-800/80 dark:bg-slate-900/90 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {description}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={`Toggle ${title}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <span
            className={`text-lg leading-none transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`}
            aria-hidden="true"
          >
            ▸
          </span>
        </button>
      </div>

      {/* Animated expand/collapse */}
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </section>
  );
}
