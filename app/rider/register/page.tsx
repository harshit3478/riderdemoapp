'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, AlertCircle, ArrowLeft, Mail, Lock, Phone, Calendar } from 'lucide-react'

export default function RiderRegister() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async () => {
    if (!firstName || !lastName || !mobile || !email || !password) {
      alert('Please fill all required fields')
      return
    }

    try {
      setIsLoading(true)

      const result = await authService.register({
        name: `${firstName} ${lastName}`,
        email,
        company: 'Individual Rider',
        location: 'Bangalore',
        type: 'rider',
        isActive: true
      }, password)

      if (result.success) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push('/rider/dashboard')
        }, 100)
      } else {
        alert(result.error || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillSampleData = () => {
    setFirstName('Rajesh')
    setLastName('Kumar')
    setDob('1995-06-15')
    setMobile('+91 9876543210')
    setEmail('rider@example.com')
    setPassword('password123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="absolute left-4 top-4 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold">Rider Registration</CardTitle>
          <CardDescription>Solo Rider Account Setup</CardDescription>
          <p className="text-sm text-gray-500">Create your individual rider account</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Demo Registration</p>
              <p>Use the sample data below for demonstration purposes.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <div className="relative">
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Rajesh"
                  className="pl-10"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <div className="relative">
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Kumar"
                  className="pl-10"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <div className="relative">
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <Label htmlFor="mobile">Mobile Number *</Label>
            <div className="relative">
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="+91 9876543210"
                className="pl-10"
              />
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rider@example.com"
                className="pl-10"
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <Button onClick={fillSampleData} variant="outline" className="w-full">
            Fill Sample Data
          </Button>
          
          <Button 
            onClick={handleRegister} 
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Complete Registration'
            )}
          </Button>

          <div className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/rider/login')}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Sign in here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
