"use client"

import { AuthProvider } from "@/components/contexts/auth-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

