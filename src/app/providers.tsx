"use client";

import { ReactElement } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material";
import { darkTheme } from "@/lib/dark.theme";
import { AuthContext } from "@/contexts/auth";

interface ProvidersProp {
  children: ReactElement | ReactElement[],
  isAuthenticated: boolean
}

export default function Provider({ children, isAuthenticated }: ProvidersProp) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={darkTheme}>
        <AuthContext.Provider value={isAuthenticated}>{children}</AuthContext.Provider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}