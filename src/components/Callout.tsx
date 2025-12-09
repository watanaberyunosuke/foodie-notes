// src/app/components/Callout.tsx
import React from "react";

interface CalloutProps {
  emoji?: string;
  children: React.ReactNode;
}

export function Callout({ emoji = "💡", children }: CalloutProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
      <div className="text-xl leading-none mt-[2px]">{emoji}</div>
      <div className="text-slate-800">{children}</div>
    </div>
  );
}
