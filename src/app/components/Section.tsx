// src/app/components/Section.tsx

import React from "react";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <div className="space-y-3 text-slate-800 text-[15px]">{children}</div>
    </section>
  );
}
