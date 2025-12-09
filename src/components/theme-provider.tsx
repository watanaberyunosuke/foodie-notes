"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"     // adds/removes "dark" on <html>
      defaultTheme="system" // follow OS by default
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
