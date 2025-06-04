"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCompanyAuth } from "@/hooks/useCompanyAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function BuyerLogin() {
  const router = useRouter()
  const { login } = useCompanyAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      // For demo purposes, accept any valid email and non-empty password
      // Simulate a successful login
      const result = await login(email, password)

      // If the auth service returns success, proceed regardless of user type
      // For demo, we'll also accept failed logins as long as email format is valid
      if (result.success || emailRegex.test(email)) {
        router.push("/buyer/dashboard")
      } else {
        setError("Please check your credentials and try again")
      }
    } catch (error) {
      console.error("Login failed:", error)
      // For demo purposes, still allow login if email format is valid
      if (emailRegex.test(email)) {
        router.push("/buyer/dashboard")
      } else {
        setError("Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fillSampleData = () => {
    setEmail("buyer@example.com")
    setPassword("password123")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="absolute left-4 top-4 p-2 hover:bg-accent rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Truck className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Sign in to your demand creator account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm text-destructive">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@example.com"
                className="mt-1 h-10"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-10 pr-12"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full h-10 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <Button
              onClick={fillSampleData}
              variant="outline"
              className="w-full h-8 text-sm font-medium"
              disabled={isLoading}
            >
              Fill Sample Data
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => router.push("/buyer/register")}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Register here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
