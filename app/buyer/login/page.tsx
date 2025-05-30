'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, AlertCircle } from 'lucide-react'

export default function BuyerLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)

      // Demo buyer login
      const buyerData = {
        id: 'buyer_demo',
        name: 'Demo Buyer',
        email: email || 'buyer@demo.com',
        company: 'Demo Company',
        location: 'Bangalore',
        type: 'buyer' as const,
        isActive: true,
        createdAt: new Date(),
      }


      // Small delay to ensure state is updated
      setTimeout(() => {
        router.push('/buyer/dashboard')
      }, 100)
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillSampleData = () => {
    setEmail('buyer@example.com')
    setPassword('password123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Buyer Login</CardTitle>
          <CardDescription>
            Sign in to your demand creator account
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
              placeholder="buyer@example.com"
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
            className="w-full bg-blue-600 hover:bg-blue-700"
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
              onClick={() => router.push('/buyer/register')}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
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
