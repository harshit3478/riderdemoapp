'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, AlertCircle } from 'lucide-react'

export default function RiderLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)

      // Demo rider login
      const riderData = {
        id: 'rider_demo',
        name: 'Demo Rider',
        email: email || 'rider@demo.com',
        location: 'Koramangala, Bangalore',
        reliabilityScore: 4.7,
        type: 'rider' as const,
        isActive: true,
        createdAt: new Date(),
      }


      // Small delay to ensure state is updated
      setTimeout(() => {
        router.push('/rider/dashboard')
      }, 100)
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillSampleData = () => {
    setEmail('rider@example.com')
    setPassword('password123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Rider Login</CardTitle>
          <CardDescription>
            Sign in to your solo rider account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Demo Access</p>
              <p>Use the sample credentials below for demonstration purposes.</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="rider@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <Button 
            onClick={handleLogin} 
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={fillSampleData} 
            className="w-full"
            disabled={isLoading}
          >
            Fill Sample Data
          </Button>
          
          <div className="text-center space-y-2">
            <button
              onClick={() => router.push('/rider/register')}
              className="text-sm text-orange-600 hover:text-orange-800 underline"
            >
              Don&apos;t have an account? Register here
            </button>
            <br />
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              ← Back to user selection
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
       
