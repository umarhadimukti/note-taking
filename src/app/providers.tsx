"use client";

import { ReactElement, useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material";
import { darkTheme } from "@/lib/dark.theme";
import { AuthContext } from "@/contexts/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProvidersProp {
  children: ReactElement | ReactElement[],
  isAuthenticated: boolean
}

export default function Provider({ children, isAuthenticated }: ProvidersProp) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={darkTheme}>
        <AuthContext.Provider value={isAuthenticated}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AuthContext.Provider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}