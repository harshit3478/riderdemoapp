'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, AlertCircle } from 'lucide-react'

export default function AdminRegister() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (formData.adminCode !== 'FLEETCONNECT_ADMIN') {
      alert('Invalid admin access code')
      return
    }

    try {
      setIsLoading(true)

      const adminData = {
        name: formData.name,
        email: formData.email,
        company: 'FleetConnect',
        location: 'Bangalore',
        type: 'admin' as const,
        isActive: true,
      }

      await authService.register(adminData, formData.password)

      // Small delay to ensure state is updated
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 100)
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillSampleData = () => {
    setFormData({
      name: 'Demo Admin',
      email: 'admin@fleetconnect.com',
      password: 'admin123',
      confirmPassword: 'admin123',
      adminCode: 'FLEETCONNECT_ADMIN',
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
          <CardDescription>
            Create your FleetConnect admin account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Demo Registration</p>
              <p>Admin code: <code className="bg-white px-1 rounded">FLEETCONNECT_ADMIN</code></p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder="admin@fleetconnect.com"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => handleInputChange('password', e.target.value)}
              placeholder="Create a password"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={e => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          
          <div>
            <Label htmlFor="adminCode">Admin Access Code</Label>
            <Input
              id="adminCode"
              value={formData.adminCode}
              onChange={e => handleInputChange('adminCode', e.target.value)}
              placeholder="Enter admin access code"
            />
          </div>
          
          <Button 
            onClick={handleRegister} 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
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
              onClick={() => router.push('/admin/login')}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Already have an account? Sign in
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
