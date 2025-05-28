'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RiderLogin() {
  const { login } = useApp()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Frontend only login simulation
    login('rider', { email, name: 'Rider User' })
    router.push('/rider/dashboard')
  }

  const fillSampleData = () => {
    setEmail('rider@example.com')
    setPassword('password123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Rider Login</h2>
        <div className="space-y-4">
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
          <Button onClick={handleLogin} className="w-full bg-purple-600 hover:bg-purple-700">Login</Button>
          <Button variant="outline" onClick={fillSampleData} className="w-full">
            Fill Sample Data
          </Button>
          <p className="text-center mt-4">
            Don&apos;t have an account?{' '}
            <a href="/rider/register" className="text-purple-600 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
