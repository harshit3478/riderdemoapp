'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function RiderRegister() {
  const { login } = useApp()
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = () => {
    // Frontend only registration simulation
    login('rider', { firstName, lastName, dob, mobile, email })
    router.push('/rider/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-[hsl(var(--secondary))]">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} aria-label="Go back" className="mr-4">
          <ArrowLeft className="text-[hsl(var(--primary))] w-6 h-6" />
        </button>
        <div>
          <h1 className="text-[hsl(var(--primary))] text-3xl font-bold">Registration</h1>
          <p className="text-[hsl(var(--secondary-foreground))] text-lg font-semibold">Account Setup</p>
        </div>
      </div>
      <div className="flex-1 max-w-md w-full bg-white rounded-lg shadow-md p-6 overflow-auto">
        <div className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="text-[hsl(var(--primary))]">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-[hsl(var(--primary))]">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
          <div>
            <Label htmlFor="dob" className="text-[hsl(var(--primary))]">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              placeholder="Date of Birth"
            />
          </div>
          <div>
            <Label htmlFor="mobile" className="text-[hsl(var(--primary))]">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="Mobile Number"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-[hsl(var(--primary))]">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-[hsl(var(--primary))]">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <Button onClick={handleRegister} className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))]">Next</Button>
        </div>
      </div>
    </div>
  )
}
