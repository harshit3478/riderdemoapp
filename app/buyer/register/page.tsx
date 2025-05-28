'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function BuyerRegister() {
  const { login } = useApp()
  const router = useRouter()

  // Step state: 1 - Account Setup, 2 - Company Details, 3 - OTP Verification
  const [step, setStep] = useState(1)

  // Account Setup fields
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Company Details fields
  const [companyName, setCompanyName] = useState('')
  const [legalEntityType, setLegalEntityType] = useState('Sole Proprietor')
  const [yearOfEstablishment, setYearOfEstablishment] = useState('')
  const [headOfficeLocation, setHeadOfficeLocation] = useState('')
  const [operatingCities, setOperatingCities] = useState<string[]>([])

  // OTP Verification field
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleNext = () => {
    if (step === 1) {
      // Validate Account Setup fields (basic)
      if (!phone || !email || !password) {
        alert('Please fill all fields')
        return
      }
      setStep(2)
    } else if (step === 2) {
      // Validate Company Details fields (basic)
      if (!companyName || !legalEntityType || !yearOfEstablishment || !headOfficeLocation) {
        alert('Please fill all required fields')
        return
      }
      setStep(3)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
  }

  const handleVerify = () => {
    // Simple OTP validation simulation
    if (otp.some(digit => digit === '')) {
      alert('Please enter complete OTP')
      return
    }
    // Simulate login and redirect
    login('buyer', { name: companyName, email })
    router.push('/buyer/dashboard')
  }

  const handleCityRemove = (city: string) => {
    setOperatingCities(operatingCities.filter(c => c !== city))
  }

  const handleCityAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const value = input.value.trim()
    if (e.key === 'Enter' && value && !operatingCities.includes(value)) {
      setOperatingCities([...operatingCities, value])
      input.value = ''
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Registration - Account Setup</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <Button onClick={handleNext} className="w-full">Next</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Registration - Company Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="legalEntityType">Legal Entity Type</Label>
                <select
                  id="legalEntityType"
                  className="w-full h-9 px-3 py-1 border border-input rounded-md text-sm"
                  value={legalEntityType}
                  onChange={e => setLegalEntityType(e.target.value)}
                >
                  <option value="Sole Proprietor">Sole Proprietor</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Private Limited">Private Limited</option>
                  <option value="Public Limited">Public Limited</option>
                </select>
              </div>
              <div>
                <Label htmlFor="yearOfEstablishment">Year of Establishment</Label>
                <Input
                  id="yearOfEstablishment"
                  type="text"
                  value={yearOfEstablishment}
                  onChange={e => setYearOfEstablishment(e.target.value)}
                  placeholder="Enter year of establishment"
                />
              </div>
              <div>
                <Label htmlFor="headOfficeLocation">Head Office Location</Label>
                <Input
                  id="headOfficeLocation"
                  type="text"
                  value={headOfficeLocation}
                  onChange={e => setHeadOfficeLocation(e.target.value)}
                  placeholder="Enter head office location"
                />
              </div>
              <div>
                <Label>Operating Cities</Label>
                <input
                  type="text"
                  placeholder="Type city and press Enter"
                  onKeyDown={handleCityAdd}
                  className="w-full h-9 px-3 py-1 border border-input rounded-md text-sm"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {operatingCities.map(city => (
                    <div key={city} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center space-x-2">
                      <span>{city}</span>
                      <button onClick={() => handleCityRemove(city)} className="font-bold">×</button>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleNext} className="w-full">Next</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Registration - OTP Verification</h2>
            <p className="mb-4 text-center text-sm text-gray-600">
              Enter the OTP sent to the Phone Number {phone}
            </p>
            <div className="flex justify-center space-x-2 mb-6">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-10 h-10 text-center text-lg font-semibold"
                />
              ))}
            </div>
            <Button onClick={handleVerify} className="w-full">Verify</Button>
          </>
        )}
      </div>
    </div>
  )
}
