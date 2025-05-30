"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserType } from "@/lib/types"
import { Truck, Users, User, Shield } from "lucide-react"

const userTypes = [
  {
    type: "restaurant" as UserType,
    title: "Restaurant",
    description: "Food delivery platforms and restaurants that need delivery services",
    icon: Truck,
    color: "from-primary to-primary/80",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    examples: ["Swiggy", "Zomato", "Blinkit", "Amazon"],
    route: "buyer", // Legacy route for backward compatibility
  },
  {
    type: "driver" as UserType,
    title: "Driver",
    description: "Fleet managers and drivers managing delivery operations",
    icon: Users,
    color: "from-secondary to-secondary/80",
    bgColor: "bg-secondary/10",
    textColor: "text-secondary",
    examples: ["Yana", "Rapid Riders", "Fleet Services"],
    route: "supplier", // Legacy route for backward compatibility
  },
  {
    type: "rider" as UserType,
    title: "Rider",
    description: "Individual delivery agents looking for flexible gig opportunities",
    icon: User,
    color: "from-fleet-mud to-fleet-brown",
    bgColor: "bg-fleet-light-mud/20",
    textColor: "text-fleet-brown",
    examples: ["Individual Riders", "Freelance Delivery"],
    route: "rider",
  },
  {
    type: "admin" as UserType,
    title: "Admin",
    description: "Administrative access to manage the entire FleetConnect platform",
    icon: Shield,
    color: "from-foreground to-fleet-grey",
    bgColor: "bg-muted",
    textColor: "text-foreground",
    examples: ["Platform Management", "System Administration"],
    route: "admin",
  },
]

export default function UserTypeSelection() {
  const router = useRouter()

  const handleUserTypeClick = (userType: UserType) => {
    const userTypeConfig = userTypes.find(ut => ut.type === userType)
    const route = userTypeConfig?.route || userType
    router.push(`/${route}/login`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FleetConnect
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            The ultimate platform connecting delivery demand with fleet supply across India
          </p>
          <div className="inline-flex items-center bg-fleet-light-mud text-fleet-brown px-6 py-3 rounded-full text-sm font-medium">
            <span className="mr-2">🚀</span>
            Demo Version - Choose your user type to continue
          </div>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {userTypes.map((userType) => {
            const Icon = userType.icon

            return (
              <Card
                key={userType.type}
                className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 bg-card/80 backdrop-blur-sm hover:bg-card"
                onClick={() => handleUserTypeClick(userType.type)}
              >
                <CardHeader className="text-center pb-6">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${userType.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-card-foreground mb-3">{userType.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {userType.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className={`${userType.bgColor} rounded-xl p-4`}>
                    <p className={`font-semibold ${userType.textColor} mb-2`}>Examples:</p>
                    <p className="text-muted-foreground text-sm">{userType.examples.join(", ")}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>



        {/* Footer */}
        <div className="text-center text-muted-foreground">
          <p className="mb-2">
            This is a demo application showcasing the Fleet Management Aggregator Platform concept.
          </p>
          <p>All data is mocked and no real transactions are processed.</p>
        </div>
      </div>
    </div>
  )
}
