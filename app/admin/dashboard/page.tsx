"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import { dataStore } from "@/lib/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import type { DashboardStats } from "@/lib/types"
import { Users, FileText, TrendingUp, Shield, Activity, MapPin } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [currentUser] = useState(authService.getCurrentUser())
  const [stats, setStats] = useState<DashboardStats>({
    totalRequirements: 0,
    activeRequirements: 0,
    completedRequirements: 0,
    totalBids: 0,
    acceptedBids: 0,
    totalRiders: 0,
    activeRiders: 0,
    averageRating: 0,
    totalRevenue: 0,
    fulfillmentRate: 0,
  })

  useEffect(() => {
    if (!currentUser || currentUser.type !== "admin") {
      router.push("/admin/login")
      return
    }
    loadData()
  }, [currentUser, router])

  const loadData = () => {
    const requirements = dataStore.getRequirements()
    const bids = dataStore.getBids()
    const riderApplications = dataStore.getRiderApplications()

    setStats({
      totalRequirements: requirements.length,
      activeRequirements: requirements.filter((req) => ["pending", "bidding", "matched"].includes(req.status)).length,
      completedRequirements: requirements.filter((req) => req.status === "completed").length,
      totalBids: bids.length,
      acceptedBids: bids.filter((bid) => bid.status === "accepted").length,
      totalRiders: riderApplications.length,
      activeRiders: riderApplications.filter((app) => app.status === "confirmed").length,
      averageRating: 4.5,
      totalRevenue: 0,
      fulfillmentRate: 85,
    })
  }

  const recentRequirements = dataStore.getRequirements().slice(0, 5)
  const recentBids = dataStore.getBids().slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="text-purple-100 mb-4">Monitor and manage the FleetConnect platform</p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-purple-100">
            <Shield className="h-4 w-4 mr-1" />
            <span className="font-medium">Admin Access</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requirements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequirements}</div>
            <p className="text-xs text-muted-foreground">{stats.activeRequirements} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBids}</div>
            <p className="text-xs text-muted-foreground">{stats.acceptedBids} accepted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Riders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRiders}</div>
            <p className="text-xs text-muted-foreground">{stats.totalRiders} total applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Requirements</CardTitle>
            <CardDescription>Latest delivery requirements posted on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequirements.map((requirement) => (
                <div key={requirement.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{requirement.title}</h4>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span>{requirement.location}</span>
                      <span>•</span>
                      <span>{requirement.quantity} riders</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(requirement.ratePerHour)}/hr</div>
                    <div className="text-xs text-gray-500">{formatDateTime(requirement.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bids */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bids</CardTitle>
            <CardDescription>Latest bids submitted by suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBids.map((bid) => (
                <div key={bid.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{bid.supplierName}</h4>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <span>{bid.quantity} riders</span>
                      <span>•</span>
                      <span className="capitalize">{bid.fulfillmentType}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(bid.proposedRate)}/hr</div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        bid.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : bid.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {bid.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/admin/users")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-purple-600" />
              Manage Users
            </CardTitle>
            <CardDescription>View and manage all platform users</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push("/admin/requirements")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-600" />
              Monitor Requirements
            </CardTitle>
            <CardDescription>Track all delivery requirements and their status</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/admin/system")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-600" />
              System Health
            </CardTitle>
            <CardDescription>Monitor platform performance and health</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
