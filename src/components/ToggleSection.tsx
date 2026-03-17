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
}: Readonly<ToggleSectionProps>) {
  // always start folded
  const [open, setOpen] = useState(false);

  return (
    <section
      id={id}
      className="group flex flex-col gap-4 rounded-3xl minimal-card p-5 sm:p-8"
    >
      {/* Header */}
      <button 
        type="button"
        className="flex items-start justify-between w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-xl"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${id}-content`}
      >
        <div className="space-y-1.5 pr-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <div className="text-sm text-slate-500 dark:text-neutral-500">
            {description}
          </div>
        </div>

        <div
          aria-hidden="true"
          className={`shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 ${open ? 'rotate-180 bg-slate-100 text-slate-900 dark:bg-neutral-800 dark:text-neutral-100' : 'text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 dark:text-neutral-500 dark:group-hover:text-neutral-200 dark:group-hover:bg-neutral-800'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Animated expand/collapse */}
      <div
        id={`${id}-content`}
        className={`grid transition-[grid-template-rows,opacity,margin] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"}`}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </section>
  );
}
