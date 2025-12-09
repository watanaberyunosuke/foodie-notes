// src/app/components/TableOfContents.tsx
import React from "react";

export interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="block rounded px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
