"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFleetAuth } from "@/hooks/useFleetAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function SupplierLogin() {
  const router = useRouter()
  const { login } = useFleetAuth()
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

      if (result.success && result.user?.type === "supplier") {
        router.push("/supplier/dashboard")
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
    setEmail("supplier@example.com")
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
            <Users className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Sign in to your fleet manager account</CardDescription>
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
                placeholder="supplier@example.com"
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
              variant="outline"
              onClick={fillSampleData}
              className="w-full h-8 text-sm font-medium"
              disabled={isLoading}
            >
              Fill Sample Data
            </Button>
          </div>

          <div className="text-center space-y-3">
            <button
              onClick={() => router.push("/supplier/register")}
              className="text-primary hover:text-primary/80 font-medium underline"
            >
              Don't have an account? Register here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
