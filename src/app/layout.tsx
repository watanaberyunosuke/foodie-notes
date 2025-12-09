// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Foodie Notes",
  description: "Your food & drink notes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          min-h-screen antialiased
          bg-slate-50 text-slate-900
          dark:bg-slate-950 dark:text-slate-100
          ${inter.className}
        `}
      >
        <ThemeProvider>
          <div
            className={`
              min-h-screen
              bg-gradient-to-b
              from-orange-50/70 via-amber-50/40 to-rose-50/70
              dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
            `}
          >
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
