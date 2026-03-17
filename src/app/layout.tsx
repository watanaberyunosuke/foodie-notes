// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "./theme-providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Foodie Notes",
  description: "Australia – Food & Drink List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 dark:bg-neutral-950 dark:text-slate-100 min-h-screen relative overflow-x-hidden selection:bg-cyan-200/40 selection:text-cyan-900 dark:selection:bg-cyan-800/40 dark:selection:text-cyan-100">
        <ThemeProviders>{children}</ThemeProviders>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
