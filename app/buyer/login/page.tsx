"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useRestaurantAuth } from "@/hooks/useRestaurantAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function BuyerLogin() {
  const router = useRouter()
  const { login } = useRestaurantAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const result = await login(email, password)

      if (result.success && result.user?.type === "buyer") {
        router.push("/buyer/dashboard")
      } else {
        setError(result.error || "Invalid credentials or user type")
      }
    } catch (error) {
      console.error("Login failed:", error)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fillSampleData = () => {
    setEmail("buyer@example.com")
    setPassword("password123")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="absolute left-4 top-4 p-2 hover:bg-muted rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Truck className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-card-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Sign in to your demand creator account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-primary">
              <p className="font-medium">Demo Access</p>
              <p>Use the sample credentials below for demonstration purposes.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-base font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@example.com"
                className="mt-2 h-12 text-base"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-base font-medium">
                Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 text-base pr-12"
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
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={fillSampleData}
              className="w-full h-12 text-lg font-medium border-2"
              disabled={isLoading}
            >
              Fill Sample Data
            </Button>
          </div>

          <div className="text-center space-y-3">
            <button
              onClick={() => router.push("/buyer/register")}
              className="text-primary hover:text-primary/80 font-medium underline"
            >
              Don&apos;t have an account? Register here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
