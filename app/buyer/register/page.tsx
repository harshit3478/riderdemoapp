'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, AlertCircle, ArrowLeft, Building, Calendar, MapPin, User, Mail, Lock } from 'lucide-react'

export default function BuyerRegister() {
  const router = useRouter()

  // Step state: 1 - Account Setup, 2 - Company Details, 3 - OTP Verification
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

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
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push('/')
    }
  }

  const handleRegister = async () => {
    if (otp.join('').length !== 6) {
      alert('Please enter complete OTP')
      return
    }

    try {
      setIsLoading(true)

      // Demo buyer registration
      const buyerData = {
        name: companyName,
        email: email,
        company: companyName,
        location: headOfficeLocation,
        type: 'restaurant' as const,
        isActive: true,
      }

      await authService.register(buyerData, password)

      // Small delay to ensure state is updated
      setTimeout(() => {
        router.push('/buyer/dashboard')
      }, 100)
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillSampleData = () => {
    if (step === 1) {
      setPhone('+91 9876543210')
      setEmail('buyer@example.com')
      setPassword('password123')
    } else if (step === 2) {
      setCompanyName('Demo Delivery Corp')
      setLegalEntityType('Private Limited')
      setYearOfEstablishment('2020')
      setHeadOfficeLocation('Bangalore, Karnataka')
      setOperatingCities(['Bangalore', 'Mumbai', 'Delhi'])
    } else if (step === 3) {
      setOtp(['1', '2', '3', '4', '5', '6'])
    }
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

  const renderStep1 = () => (
    <CardContent className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-yellow-800">
          <p className="font-medium">Demo Registration</p>
          <p>Use the sample data below for demonstration purposes.</p>
        </div>
      </div>
      
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+91 9876543210"
            className="pl-10"
          />
          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="buyer@example.com"
            className="pl-10"
          />
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
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
      
      <Button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90">
        Continue to Company Details
      </Button>
    </CardContent>
  )

  const renderStep2 = () => (
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="companyName">Company Name *</Label>
        <div className="relative">
          <Input
            id="companyName"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="Demo Delivery Corp"
            className="pl-10"
          />
          <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="legalEntityType">Legal Entity Type *</Label>
        <select
          id="legalEntityType"
          value={legalEntityType}
          onChange={e => setLegalEntityType(e.target.value)}
          className="w-full p-2 border border-input bg-background text-foreground rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <option value="Sole Proprietor">Sole Proprietor</option>
          <option value="Partnership">Partnership</option>
          <option value="Private Limited">Private Limited</option>
          <option value="Public Limited">Public Limited</option>
        </select>
      </div>
      
      <div>
        <Label htmlFor="yearOfEstablishment">Year of Establishment *</Label>
        <div className="relative">
          <Input
            id="yearOfEstablishment"
            type="number"
            value={yearOfEstablishment}
            onChange={e => setYearOfEstablishment(e.target.value)}
            placeholder="2020"
            className="pl-10"
          />
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="headOfficeLocation">Head Office Location *</Label>
        <div className="relative">
          <Input
            id="headOfficeLocation"
            value={headOfficeLocation}
            onChange={e => setHeadOfficeLocation(e.target.value)}
            placeholder="Bangalore, Karnataka"
            className="pl-10"
          />
          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div>
        <Label>Operating Cities</Label>
        <input
          type="text"
          placeholder="Type city and press Enter"
          onKeyDown={handleCityAdd}
          className="w-full p-2 border border-input bg-background text-foreground rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {operatingCities.map(city => (
            <div key={city} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center space-x-2">
              <span>{city}</span>
              <button onClick={() => handleCityRemove(city)} className="font-bold hover:text-destructive transition-colors">×</button>
            </div>
          ))}
        </div>
      </div>
      
      <Button onClick={fillSampleData} variant="outline" className="w-full">
        Fill Sample Data
      </Button>
      
      <Button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90">
        Continue to Verification
      </Button>
    </CardContent>
  )

  const renderStep3 = () => (
    <CardContent className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground">Enter the 6-digit OTP sent to</p>
        <p className="font-medium text-foreground">{phone}</p>
      </div>
      
      <div className="flex justify-center space-x-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={e => handleOtpChange(index, e.target.value)}
            className="w-12 h-12 text-center text-lg font-medium"
          />
        ))}
      </div>
      
      <Button onClick={fillSampleData} variant="outline" className="w-full">
        Fill Sample OTP
      </Button>
      
      <Button
        onClick={handleRegister}
        className="w-full bg-primary hover:bg-primary/90"
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
    </CardContent>
  )

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Account Setup'
      case 2: return 'Company Details'
      case 3: return 'OTP Verification'
      default: return 'Registration'
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Create your buyer account credentials'
      case 2: return 'Tell us about your company'
      case 3: return 'Verify your phone number'
      default: return 'Complete your registration'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="absolute left-4 top-4 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <CardTitle className="text-2xl font-bold">Buyer Registration</CardTitle>
          <CardDescription>{getStepTitle()}</CardDescription>
          <p className="text-sm text-muted-foreground">{getStepDescription()}</p>

          {/* Progress indicator */}
          <div className="flex justify-center mt-4">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-1 text-sm font-medium ${
                  stepNumber <= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
        </CardHeader>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        <CardContent>
          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/buyer/login')}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign in here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
