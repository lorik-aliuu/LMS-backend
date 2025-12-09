"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import type { AuthResponse } from "@/lib/types"
import { useAuth } from "@/components/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface RegisterDTO {
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  confirmPassword: string
}

export function RegisterForm() {
  const { login } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState<RegisterDTO>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Passwords do not match"
      setError(errorMsg)
      toast({
        title: "Validation Error",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError("")

    try {
      if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.")
      }

      
      const registerResponse = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FirstName: formData.firstName,
          LastName: formData.lastName,
          UserName: formData.userName,
          Email: formData.email,
          Password: formData.password,
          ConfirmPassword: formData.confirmPassword,
        }),
      })

      let errorMessage = "Registration failed"
      
      if (!registerResponse.ok) {
        try {
          const errorData = await registerResponse.json()
          errorMessage = errorData.message || errorData.error || `Server error: ${registerResponse.status} ${registerResponse.statusText}`
        } catch {
          errorMessage = `Network error: ${registerResponse.status} ${registerResponse.statusText}`
        }
        throw new Error(errorMessage)
      }

      const registerData = await registerResponse.json()

      if (!registerData.success) {
        errorMessage = registerData.message || "Registration failed"
        throw new Error(errorMessage)
      }

     
      const loginResponse = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: formData.email,
          Password: formData.password,
        }),
      })

      if (!loginResponse.ok) {
        try {
          const errorData = await loginResponse.json()
          errorMessage = errorData.message || errorData.error || `Auto-login failed: ${loginResponse.status} ${loginResponse.statusText}`
        } catch {
          errorMessage = `Auto-login failed: ${loginResponse.status} ${loginResponse.statusText}`
        }
        throw new Error(errorMessage)
      }

      const loginData: AuthResponse = await loginResponse.json()

      if (!loginData.success) {
        errorMessage = loginData.message || "Auto-login failed"
        throw new Error(errorMessage)
      }

      login(loginData.data)
      toast({
        title: "Success",
        description: "Account created successfully! You have been logged in.",
      })
    } catch (err) {
      const errorMsg = err instanceof Error 
        ? err.message 
        : err instanceof TypeError && err.message === "Failed to fetch"
          ? "Unable to connect to the server. Please check your internet connection"
          : "An error occurred during registration."
      
      setError(errorMsg)
      toast({
        title: "Registration Failed",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-3 text-center pb-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary">
          <BookOpen className="h-7 w-7 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Create Account</CardTitle>
        <CardDescription className="text-muted-foreground">Join our library</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="h-11 bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-foreground font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="h-11 bg-background"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-foreground font-medium">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="userName"
                name="userName"
                type="text"
                value={formData.userName}
                onChange={handleChange}
                className="pl-10 h-11 bg-background"
                required
              />
            </div>
          </div>
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
                placeholder="Create a password"
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 pr-10 h-11 bg-background"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
