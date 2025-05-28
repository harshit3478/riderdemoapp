'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Modal } from '@/components/ui/modal'
import { ArrowLeft } from 'lucide-react'

export default function SupplierRegister() {
  const { login } = useApp()
  const router = useRouter()
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

  const handleRegister = () => {
    // Frontend only registration simulation
    login('supplier', { companyName, legalEntityType, establishmentYear, headOffice, operatingCities, operatingFleetSize, floatingFleetSize, numberOfRiders, currentCustomers, afterSalesServiceProvider })
    router.push('/supplier/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-[hsl(var(--secondary))]">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} aria-label="Go back" className="mr-4">
          <ArrowLeft className="text-[hsl(var(--primary))] w-6 h-6" />
        </button>
        <div>
          <h1 className="text-[hsl(var(--primary))] text-3xl font-bold">Registration</h1>
          <p className="text-[hsl(var(--accent))] text-lg font-semibold">Company Details</p>
        </div>
      </div>
      <div className="flex-1 max-w-md w-full bg-white rounded-lg shadow-md p-6 overflow-auto space-y-4">
        <div>
          <Label htmlFor="companyName" className="text-[hsl(var(--primary))]">Company Name</Label>
          <Input
            id="companyName"
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="Company Name"
          />
        </div>
        <div>
          <Label htmlFor="legalEntityType" className="text-[hsl(var(--primary))]">Legal Entity Type</Label>
          <select
            id="legalEntityType"
            value={legalEntityType}
            onChange={e => setLegalEntityType(e.target.value)}
            className="w-full rounded-md border border-[hsl(var(--border))] px-3 py-2 text-[hsl(var(--foreground))]"
          >
            <option value="Sole Proprietor">Sole Proprietor</option>
            <option value="Partnership">Partnership</option>
            <option value="Private Limited">Private Limited</option>
            <option value="Public Limited">Public Limited</option>
          </select>
        </div>
        <div>
          <Label htmlFor="establishmentYear" className="text-[hsl(var(--primary))]">Year of Establishment</Label>
          <Input
            id="establishmentYear"
            type="text"
            value={establishmentYear}
            onChange={e => setEstablishmentYear(e.target.value)}
            placeholder="Year of Establishment"
          />
        </div>
        <div>
          <Label htmlFor="headOffice" className="text-[hsl(var(--primary))]">Head Office Location</Label>
          <Input
            id="headOffice"
            type="text"
            value={headOffice}
            onChange={e => setHeadOffice(e.target.value)}
            placeholder="Head Office Location"
          />
        </div>
        <div>
          <Label htmlFor="operatingCities" className="text-[hsl(var(--primary))]">Operating Cities</Label>
          <Input
            id="operatingCities"
            type="text"
            value={operatingCities.join(', ')}
            onChange={e => setOperatingCities(e.target.value.split(',').map(city => city.trim()))}
            placeholder="Enter cities separated by commas"
          />
        </div>
        <div>
          <Label htmlFor="operatingFleetSize" className="text-[hsl(var(--primary))]">Operating Fleet Size</Label>
          <Input
            id="operatingFleetSize"
            type="text"
            value={operatingFleetSize}
            onChange={e => setOperatingFleetSize(e.target.value)}
            placeholder="Operating Fleet Size"
          />
        </div>
        <div>
          <Label htmlFor="floatingFleetSize" className="text-[hsl(var(--primary))]">Floating Fleet Size</Label>
          <Input
            id="floatingFleetSize"
            type="text"
            value={floatingFleetSize}
            onChange={e => setFloatingFleetSize(e.target.value)}
            placeholder="Floating Fleet Size"
          />
        </div>
        <div>
          <Label htmlFor="numberOfRiders" className="text-[hsl(var(--primary))]">Number of Riders</Label>
          <Input
            id="numberOfRiders"
            type="text"
            value={numberOfRiders}
            onChange={e => setNumberOfRiders(e.target.value)}
            placeholder="Number of Riders"
          />
        </div>
        <div>
          <Label htmlFor="currentCustomers" className="text-[hsl(var(--primary))]">Current Customers</Label>
          <Input
            id="currentCustomers"
            type="text"
            value={currentCustomers.join(', ')}
            onChange={e => setCurrentCustomers(e.target.value.split(',').map(cust => cust.trim()))}
            placeholder="Enter customers separated by commas"
          />
        </div>
        <div>
          <Label htmlFor="afterSalesServiceProvider" className="text-[hsl(var(--primary))]">After Sales Service Provider</Label>
          <Input
            id="afterSalesServiceProvider"
            type="text"
            value={afterSalesServiceProvider}
            onChange={e => setAfterSalesServiceProvider(e.target.value)}
            placeholder="After Sales Service Provider"
          />
        </div>
        <Button onClick={handleRegister} className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))]">Get Started</Button>
      </div>
    </div>
  )
}
