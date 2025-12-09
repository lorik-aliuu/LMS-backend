

import type { RefreshTokenResponse } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7112/api"

interface TokenData {
  accessToken: string
  refreshToken: string
  expiresAt: Date
}


let tokenData: TokenData | null = null
let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null
let onTokenRefreshFailed: (() => void) | null = null

export function setTokenRefreshFailedCallback(callback: () => void) {
  onTokenRefreshFailed = callback
}

export function setTokens(accessToken: string, refreshToken: string, expiresAt: string) {
  tokenData = {
    accessToken,
    refreshToken,
    expiresAt: new Date(expiresAt),
  }


  scheduleTokenRefresh()
}

export function getAccessToken(): string | null {
  return tokenData?.accessToken || null
}

export function getRefreshToken(): string | null {
  return tokenData?.refreshToken || null
}

export function clearTokens() {
  tokenData = null
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId)
    refreshTimeoutId = null
  }
}

export function hasValidTokens(): boolean {
  if (!tokenData) return false
  
  return new Date(tokenData.expiresAt.getTime() - 30000) > new Date()
}

function scheduleTokenRefresh() {
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId)
  }

  if (!tokenData) return

  
  const now = new Date()
  const expiresAt = tokenData.expiresAt
  const refreshTime = expiresAt.getTime() - now.getTime() - 60000 

  if (refreshTime <= 0) {
  
    refreshAccessToken()
    return
  }

  refreshTimeoutId = setTimeout(() => {
    refreshAccessToken()
  }, refreshTime)
}

async function refreshAccessToken(): Promise<boolean> {
  if (!tokenData) return false

  try {
    const response = await fetch(`${API_BASE_URL}/Auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
      }),
    })

    const data: RefreshTokenResponse = await response.json()

    if (data.success && data.data) {
      setTokens(data.data.token, data.data.refreshToken, data.data.expiresAt)
      return true
    } else {
      clearTokens()
      onTokenRefreshFailed?.()
      return false
    }
  } catch (error) {
    console.error("Token refresh failed:", error)
    clearTokens()
    onTokenRefreshFailed?.()
    return false
  }
}


export async function tryRefreshToken(): Promise<boolean> {
  return refreshAccessToken()
}
