// src/components/ToggleSection.tsx
"use client";

import { useState, ReactNode } from "react";

type ToggleSectionProps = {
  id: string;              // now required, used for anchor + TOC
  title: string;
  description?: ReactNode;
  children: ReactNode;
  onToggle?: (isOpen: boolean) => void;
};

export function ToggleSection({
  id,
  title,
  description,
  children,
  onToggle,
}: Readonly<ToggleSectionProps>) {
  // always start folded
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    onToggle?.(newOpen);
  };

  return (
    <section
      id={id}
      className="group flex flex-col gap-4 rounded-[2.5rem] bg-white/40 dark:bg-neutral-900/40 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-6 sm:p-10 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      {/* Header */}
      <button 
        type="button"
        className="flex items-start justify-between w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-xl"
        onClick={handleToggle}
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
          className={`shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'rotate-180 bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl' : 'text-slate-400 bg-slate-100 group-hover:bg-slate-200 group-hover:text-slate-900 dark:bg-white/5 dark:text-neutral-500 dark:group-hover:text-neutral-200 dark:group-hover:bg-white/10'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Animated expand/collapse */}
      <div
        id={`${id}-content`}
        className={`grid transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "grid-rows-[1fr] opacity-100 mt-4 translate-y-0" : "grid-rows-[0fr] opacity-0 mt-0 -translate-y-4"}`}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </section>
  );
}
