// src/app/theme-providers.tsx
"use client";

import { ReactNode, useMemo } from "react";
import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

function MuiThemeBridge({ children }: { children: ReactNode }) {
  // Read theme from next-themes
  const { theme, systemTheme } = useNextTheme();

  // Resolve actual mode: "light" | "dark"
  const mode =
    (theme === "system" ? systemTheme : theme) === "dark" ? "dark" : "light";

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export function ThemeProviders({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system" // 👈 follow system theme by default
      enableSystem          // 👈 allow OS theme detection
    >
      <MuiThemeBridge>{children}</MuiThemeBridge>
    </NextThemeProvider>
  );
}
