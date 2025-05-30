'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserType } from '@/lib/types'
import { Truck, Users, User } from 'lucide-react'

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
  }
]

export default function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<UserType | null>(null)
  const router = useRouter()

  const handleLogin = (userType: UserType) => {
    // Redirect to respective login page
    router.push(`/${userType}/login`)
  }

  const handleRegister = (userType: UserType) => {
    // Redirect to respective registration page
    router.push(`/${userType}/register`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* TODO: Add main-hero-background.png from Figma design */}
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          {/* TODO: Add FleetConnect logo from Figma */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">FleetConnect</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The ultimate platform connecting delivery demand with fleet supply across India
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              🚀 Demo Version - Choose your user type to continue
            </span>
          </div>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {userTypes.map((userType) => {
            const Icon = userType.icon
            const isSelected = selectedType === userType.type

            return (
              <Card
                key={userType.type}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? 'ring-2 ring-primary shadow-lg transform scale-105'
                    : 'hover:transform hover:scale-102'
                }`}
                onClick={() => setSelectedType(userType.type)}
              >
                <CardHeader className="text-center pb-4">
                  {/* TODO: Replace with actual user type icons from Figma */}
                  <div className={`w-12 h-12 md:w-16 md:h-16 ${userType.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <CardTitle className="text-base md:text-lg">{userType.title}</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {userType.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Examples:</p>
                    <p className="line-clamp-2">{userType.examples.join(', ')}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Modal for Action Buttons */}
        {selectedType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-auto">
              <h3 className="text-lg font-semibold mb-2">
                Continue as {userTypes.find(u => u.type === selectedType)?.title}
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Sign in to your existing account or create a new one to get started
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => handleLogin(selectedType)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRegister(selectedType)}
                  className="w-full"
                >
                  Create Account
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedType(null)}
                  className="w-full text-gray-500"
                >
                  Back to Selection
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
