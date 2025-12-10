// src/components/ToggleSection.tsx
"use client";

import { useState, ReactNode } from "react";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

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
      className="
        rounded-2xl border border-slate-200/80 bg-white/90 shadow-md
        dark:border-slate-800/80 dark:bg-slate-900/90
        p-4 sm:p-6 space-y-3
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {description}
        </div>

        {/* Material UI arrow toggle */}
        <IconButton
          onClick={() => setOpen((o) => !o)}
          size="small"
          aria-label={`Toggle ${title}`}
          sx={{
            transition: "transform 0.25s ease",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            color: "text.secondary",
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
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </section>
  );
}
