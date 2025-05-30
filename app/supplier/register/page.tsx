'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, AlertCircle, ArrowLeft, Building, Calendar, MapPin, Truck, UserCheck } from 'lucide-react'

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

      // Demo supplier registration
      const supplierData = {
        id: 'supplier_' + Date.now(),
        name: companyName,
        email: 'supplier@example.com',
        company: companyName,
        location: headOffice,
        type: 'supplier' as const,
        isActive: true,
        createdAt: new Date(),
      }

      await auth.login('supplier', supplierData)

      // Small delay to ensure state is updated
      setTimeout(() => {
        router.push('/supplier/dashboard')
      }, 100)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="absolute left-4 top-4 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold">Supplier Registration</CardTitle>
          <CardDescription>Fleet Manager Account Setup</CardDescription>
          <p className="text-sm text-gray-500">Register your fleet management company</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Demo Registration</p>
              <p>Use the sample data below for demonstration purposes.</p>
            </div>
          </div>

          {/* Basic Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Company Information</h3>
            
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <div className="relative">
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Elite Fleet Services"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Sole Proprietor">Sole Proprietor</option>
                <option value="Partnership">Partnership</option>
                <option value="Private Limited">Private Limited</option>
                <option value="Public Limited">Public Limited</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="establishmentYear">Establishment Year *</Label>
                <div className="relative">
                  <Input
                    id="establishmentYear"
                    type="number"
                    value={establishmentYear}
                    onChange={e => setEstablishmentYear(e.target.value)}
                    placeholder="2018"
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="headOffice">Head Office Location *</Label>
                <div className="relative">
                  <Input
                    id="headOffice"
                    value={headOffice}
                    onChange={e => setHeadOffice(e.target.value)}
                    placeholder="Mumbai, Maharashtra"
                    className="pl-10"
                  />
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <Label>Operating Cities</Label>
              <input
                type="text"
                placeholder="Type city and press Enter"
                onKeyDown={handleCityAdd}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
          </div>

          {/* Fleet Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Fleet Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="operatingFleetSize">Operating Fleet Size</Label>
                <div className="relative">
                  <Input
                    id="operatingFleetSize"
                    type="number"
                    value={operatingFleetSize}
                    onChange={e => setOperatingFleetSize(e.target.value)}
                    placeholder="50"
                    className="pl-10"
                  />
                  <Truck className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="floatingFleetSize">Floating Fleet Size</Label>
                <div className="relative">
                  <Input
                    id="floatingFleetSize"
                    type="number"
                    value={floatingFleetSize}
                    onChange={e => setFloatingFleetSize(e.target.value)}
                    placeholder="20"
                    className="pl-10"
                  />
                  <Truck className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="numberOfRiders">Number of Riders</Label>
              <div className="relative">
                <Input
                  id="numberOfRiders"
                  type="number"
                  value={numberOfRiders}
                  onChange={e => setNumberOfRiders(e.target.value)}
                  placeholder="75"
                  className="pl-10"
                />
                <UserCheck className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <Label>Current Customers</Label>
              <input
                type="text"
                placeholder="Type customer name and press Enter"
                onKeyDown={handleCustomerAdd}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {currentCustomers.map(customer => (
                  <div key={customer} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center space-x-2">
                    <span>{customer}</span>
                    <button onClick={() => handleCustomerRemove(customer)} className="font-bold">×</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="afterSalesServiceProvider">After Sales Service Provider</Label>
              <Input
                id="afterSalesServiceProvider"
                value={afterSalesServiceProvider}
                onChange={e => setAfterSalesServiceProvider(e.target.value)}
                placeholder="In-house Service Team"
              />
            </div>
          </div>

          <Button onClick={fillSampleData} variant="outline" className="w-full">
            Fill Sample Data
          </Button>
          
          <Button 
            onClick={handleRegister} 
            className="w-full bg-green-600 hover:bg-green-700"
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
              onClick={() => router.push('/supplier/login')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign in here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
