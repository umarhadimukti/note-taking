"use client";

import { createContext, useContext } from "react";

export const AuthContext = createContext<boolean>(false);

export function useAuth() {
  return useContext(AuthContext);
}