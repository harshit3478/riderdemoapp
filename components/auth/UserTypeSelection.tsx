'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserType } from '@/lib/types'
import { Truck, Users, User, Shield } from 'lucide-react'
import { useApp } from '@/lib/context/AppContext'

const userTypes = [
  {
    type: 'buyer' as UserType,
    title: 'Demand Creator',
    description: 'Companies like Swiggy, Zomato, Blinkit that need delivery riders',
    icon: Truck,
    color: 'bg-blue-500',
    examples: ['Swiggy', 'Zomato', 'Blinkit', 'Amazon'],
  },
  {
    type: 'supplier' as UserType,
    title: 'Fleet Manager',
    description: 'Middlemen managing multiple riders and fleet operations',
    icon: Users,
    color: 'bg-green-500',
    examples: ['Yana', 'Rapid Riders', 'Fleet Services'],
  },
  {
    type: 'rider' as UserType,
    title: 'Solo Rider',
    description: 'Individual delivery agents looking for flexible gig opportunities',
    icon: User,
    color: 'bg-orange-500',
    examples: ['Individual Riders', 'Freelance Delivery'],
  },
  {
    type: 'admin' as UserType,
    title: 'Platform Admin',
    description: 'Administrative access to monitor and manage the platform',
    icon: Shield,
    color: 'bg-purple-500',
    examples: ['FleetConnect Team'],
  },
]

export default function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<UserType | null>(null)
  const { login } = useApp()
  const router = useRouter()

  const handleLogin = (userType: UserType) => {
    // Mock login with predefined user data based on type
    const mockUserData = {
      buyer: {
        id: 'buyer_demo',
        name: 'Demo Buyer',
        email: 'buyer@demo.com',
        company: 'Demo Company',
        location: 'Bangalore',
      },
      supplier: {
        id: 'supplier_demo',
        name: 'Demo Supplier',
        email: 'supplier@demo.com',
        company: 'Demo Fleet Services',
        location: 'Bangalore',
        reliabilityScore: 4.5,
      },
      rider: {
        id: 'rider_demo',
        name: 'Demo Rider',
        email: 'rider@demo.com',
        location: 'Koramangala, Bangalore',
        reliabilityScore: 4.7,
      },
      admin: {
        id: 'admin_demo',
        name: 'Demo Admin',
        email: 'admin@demo.com',
        company: 'FleetConnect',
        location: 'Bangalore',
      },
    }

    login(userType, mockUserData[userType])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">FleetConnect</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The ultimate platform connecting delivery demand with fleet supply across India
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              🚀 Demo Version - Choose your user type to explore
            </span>
          </div>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userTypes.map((userType) => {
            const Icon = userType.icon
            const isSelected = selectedType === userType.type
            
            return (
              <Card
                key={userType.type}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 shadow-lg transform scale-105' 
                    : 'hover:transform hover:scale-102'
                }`}
                onClick={() => setSelectedType(userType.type)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${userType.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{userType.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {userType.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-500">
                    <p className="font-medium mb-1">Examples:</p>
                    <p>{userType.examples.join(', ')}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        {selectedType && (
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">
                Continue as {userTypes.find(u => u.type === selectedType)?.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                You'll be logged in with demo credentials to explore the platform
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setSelectedType(null)}
                >
                  Back
                </Button>
                <Button
                  onClick={() => handleLogin(selectedType)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            This is a demo application showcasing the Fleet Management Aggregator Platform concept.
          </p>
          <p className="mt-1">
            All data is mocked and no real transactions are processed.
          </p>
        </div>
      </div>
    </div>
  )
}
