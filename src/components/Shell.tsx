// src/app/components/Shell.tsx
import React from "react";

interface ShellProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function Shell({ sidebar, children }: ShellProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.15em] text-slate-500">
              Notes
            </span>
            <span className="text-sm font-medium text-slate-800">
              Food & Drink List
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Next.js • React Compiler • Vercel Postgres
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 flex gap-8">
        {sidebar && (
          <aside className="hidden md:block w-52 shrink-0 text-sm">
            <div className="sticky top-24">{sidebar}</div>
          </aside>
        )}

        <section className="flex-1 pb-16">
          {children}
        </section>
      </main>
    </div>
  );
}
