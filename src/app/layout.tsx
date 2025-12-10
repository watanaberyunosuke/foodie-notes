// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProviders } from "./theme-providers";

export const metadata: Metadata = {
  title: "Foodie Notes",
  description: "Australia – Food & Drink List",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProviders>{children}</ThemeProviders>
      </body>
    </html>
  );
}
