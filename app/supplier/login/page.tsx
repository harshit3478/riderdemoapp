'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


export default function SupplierLogin() {
  const { login } = useApp()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Frontend only login simulation
    login('supplier', { email, name: 'Supplier User' })
    router.push('/supplier/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-[hsl(var(--secondary))]">
      <div className="flex items-center mb-6">
        <h1 className="text-[hsl(var(--primary))] text-3xl font-bold">Login</h1>
        <p className="text-[hsl(var(--accent))] text-lg font-semibold ml-4">Supplier Account</p>
      </div>
      <div className="flex-1 max-w-md w-full bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <Label htmlFor="email" className="text-[hsl(var(--primary))]">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="supplier@example.com"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-[hsl(var(--primary))]">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <Button onClick={handleLogin} className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))]">Login</Button>
        <p className="text-center mt-4">
          Don&apos;t have an account?{' '}
          <a href="/supplier/register" className="text-[hsl(var(--primary))] hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  )
}
