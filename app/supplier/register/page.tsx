'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ArrowLeft, Building, Calendar, MapPin, Truck, UserCheck } from 'lucide-react'

export default function SupplierRegister() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const [companyName, setCompanyName] = useState('')
  const [legalEntityType, setLegalEntityType] = useState('Sole Proprietor')
  const [establishmentYear, setEstablishmentYear] = useState('')
  const [headOffice, setHeadOffice] = useState('')
  const [operatingCities, setOperatingCities] = useState<string[]>([])
  const [operatingFleetSize, setOperatingFleetSize] = useState('')
  const [floatingFleetSize, setFloatingFleetSize] = useState('')
  const [numberOfRiders, setNumberOfRiders] = useState('')
  const [currentCustomers, setCurrentCustomers] = useState<string[]>([])
  const [afterSalesServiceProvider, setAfterSalesServiceProvider] = useState('')

  const handleRegister = async () => {
    if (!companyName || !establishmentYear || !headOffice) {
      alert('Please fill all required fields')
      return
    }

    try {
      setIsLoading(true)

      const result = await authService.register({
        name: companyName,
        email: 'supplier@example.com',
        company: companyName,
        location: headOffice,
        type: 'supplier',
        isActive: true
      }, 'password123')

      if (result.success) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push('/supplier/dashboard')
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
    setCompanyName('Elite Fleet Services')
    setLegalEntityType('Private Limited')
    setEstablishmentYear('2018')
    setHeadOffice('Mumbai, Maharashtra')
    setOperatingCities(['Mumbai', 'Pune', 'Nashik'])
    setOperatingFleetSize('50')
    setFloatingFleetSize('20')
    setNumberOfRiders('75')
    setCurrentCustomers(['Swiggy', 'Zomato', 'Amazon'])
    setAfterSalesServiceProvider('In-house Service Team')
  }

  const handleCityAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const value = input.value.trim()
    if (e.key === 'Enter' && value && !operatingCities.includes(value)) {
      setOperatingCities([...operatingCities, value])
      input.value = ''
    }
  }

  const handleCityRemove = (city: string) => {
    setOperatingCities(operatingCities.filter(c => c !== city))
  }

  const handleCustomerAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const value = input.value.trim()
    if (e.key === 'Enter' && value && !currentCustomers.includes(value)) {
      setCurrentCustomers([...currentCustomers, value])
      input.value = ''
    }
  }

  const handleCustomerRemove = (customer: string) => {
    setCurrentCustomers(currentCustomers.filter(c => c !== customer))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="absolute left-4 top-4 p-2 hover:bg-accent rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>

          <CardTitle className="text-2xl font-bold text-foreground">Supplier Registration</CardTitle>
          <CardDescription className="text-muted-foreground">Fleet Manager Account Setup</CardDescription>
          <p className="text-sm text-muted-foreground">Register your fleet management company</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Company Information</h3>
            
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium">Company Name *</Label>
              <div className="relative mt-1">
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Elite Fleet Services"
                  className="pl-10 h-10"
                />
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="legalEntityType" className="text-sm font-medium">Legal Entity Type *</Label>
              <select
                id="legalEntityType"
                value={legalEntityType}
                onChange={e => setLegalEntityType(e.target.value)}
                className="w-full h-10 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent mt-1"
              >
                <option value="Sole Proprietor">Sole Proprietor</option>
                <option value="Partnership">Partnership</option>
                <option value="Private Limited">Private Limited</option>
                <option value="Public Limited">Public Limited</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="establishmentYear" className="text-sm font-medium">Establishment Year *</Label>
                <div className="relative mt-1">
                  <Input
                    id="establishmentYear"
                    type="number"
                    value={establishmentYear}
                    onChange={e => setEstablishmentYear(e.target.value)}
                    placeholder="2018"
                    className="pl-10 h-10"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="headOffice" className="text-sm font-medium">Head Office Location *</Label>
                <div className="relative mt-1">
                  <Input
                    id="headOffice"
                    value={headOffice}
                    onChange={e => setHeadOffice(e.target.value)}
                    placeholder="Mumbai, Maharashtra"
                    className="pl-10 h-10"
                  />
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Operating Cities</Label>
              <input
                type="text"
                placeholder="Type city and press Enter"
                onKeyDown={handleCityAdd}
                className="w-full h-10 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent mt-1"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {operatingCities.map(city => (
                  <div key={city} className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center space-x-2 border border-primary/20">
                    <span>{city}</span>
                    <button onClick={() => handleCityRemove(city)} className="font-bold hover:text-destructive">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fleet Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Fleet Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="operatingFleetSize" className="text-sm font-medium">Operating Fleet Size</Label>
                <div className="relative mt-1">
                  <Input
                    id="operatingFleetSize"
                    type="number"
                    value={operatingFleetSize}
                    onChange={e => setOperatingFleetSize(e.target.value)}
                    placeholder="50"
                    className="pl-10 h-10"
                  />
                  <Truck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="floatingFleetSize" className="text-sm font-medium">Floating Fleet Size</Label>
                <div className="relative mt-1">
                  <Input
                    id="floatingFleetSize"
                    type="number"
                    value={floatingFleetSize}
                    onChange={e => setFloatingFleetSize(e.target.value)}
                    placeholder="20"
                    className="pl-10 h-10"
                  />
                  <Truck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="numberOfRiders" className="text-sm font-medium">Number of Riders</Label>
              <div className="relative mt-1">
                <Input
                  id="numberOfRiders"
                  type="number"
                  value={numberOfRiders}
                  onChange={e => setNumberOfRiders(e.target.value)}
                  placeholder="75"
                  className="pl-10 h-10"
                />
                <UserCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Current Customers</Label>
              <input
                type="text"
                placeholder="Type customer name and press Enter"
                onKeyDown={handleCustomerAdd}
                className="w-full h-10 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent mt-1"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {currentCustomers.map(customer => (
                  <div key={customer} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full flex items-center space-x-2 border border-secondary/20">
                    <span>{customer}</span>
                    <button onClick={() => handleCustomerRemove(customer)} className="font-bold hover:text-destructive">×</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="afterSalesServiceProvider" className="text-sm font-medium">After Sales Service Provider</Label>
              <Input
                id="afterSalesServiceProvider"
                value={afterSalesServiceProvider}
                onChange={e => setAfterSalesServiceProvider(e.target.value)}
                placeholder="In-house Service Team"
                className="h-10 mt-1"
              />
            </div>
          </div>

          <Button onClick={fillSampleData} variant="outline" className="w-full h-8 text-sm font-medium">
            Fill Sample Data
          </Button>

          <Button
            onClick={handleRegister}
            className="w-full h-10 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Complete Registration'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/supplier/login')}
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
