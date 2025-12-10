"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/components/contexts/auth-context"
import { Toaster } from "sonner"


export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SignalRWrapper>{children}</SignalRWrapper>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  )
}

function SignalRWrapper({ children }: { children: ReactNode }) {
  const { useUserNotification } = require("@/hooks/useUserNotification")
  useUserNotification()
  return <>{children}</>
}
