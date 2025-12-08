"use client";

import { useState } from "react";

interface ToggleProps {
  title: string;
  children: React.ReactNode;
}

export function Toggle({ title, children }: ToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-md px-2 py-1 hover:bg-slate-50 cursor-pointer select-none text-sm"
      onClick={() => setOpen((o) => !o)}
    >
      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-500">{open ? "▾" : "▸"}</span>
        <span className="text-slate-800">{title}</span>
      </div>
      {open && (
        <div className="mt-2 ml-5 text-slate-700 space-y-2">{children}</div>
      )}
    </div>
  );
}
