"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/contexts/auth-context"
import type { AuthResponse } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface LoginDTO {
  email: string
  password: string
}

export function LoginForm() {
  const { login } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState<LoginDTO>({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.")
      }

      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: formData.email,
          Password: formData.password,
        }),
      })

      let errorMessage = "Login failed"
      
      if (!response.ok) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || `Server error: ${response.status} ${response.statusText}`
        } catch {
          errorMessage = `Network error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data: AuthResponse = await response.json()

      if (!data.success) {
        errorMessage = data.message || "Login failed"
        throw new Error(errorMessage)
      }

      login(data.data)
      toast({
        title: "Success",
        description: "You have been logged in successfully!",
      })
    } catch (err) {
      const errorMsg = err instanceof Error 
        ? err.message 
        : err instanceof TypeError && err.message === "Failed to fetch"
          ? "Unable to connect to the server."
          : "An error occurred during login"
      
      setError(errorMsg)
      toast({
        title: "Login Failed",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary">
          <BookOpen className="h-7 w-7 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground">Sign in to access your library account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 h-11 bg-background"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10 h-11 bg-background"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Dont have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
