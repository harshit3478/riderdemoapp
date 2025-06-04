"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useDataStore } from "@/hooks/useDataStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import type { DashboardStats } from "@/lib/types"
import { Users, FileText, TrendingUp, Shield, Activity, MapPin } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const { user: currentUser, isAuthenticated } = useAdminAuth()
  const { dataStore, isInitialized } = useDataStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  const loadData = useCallback(async () => {
    if (!isInitialized || !currentUser) return

    try {
      setLoading(true)
      setError(null)

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
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.")
      console.error("Dashboard loading error:", err)
    } finally {
      setLoading(false)
    }
  }, [currentUser, isInitialized, dataStore])

  useEffect(() => {
    if (!currentUser || currentUser.type !== "admin") {
      router.push("/admin/login")
      return
    }
    loadData()
  }, [currentUser, router, loadData])

  const recentRequirements = isInitialized ? dataStore.getRequirements().slice(0, 5) : []
  const recentBids = isInitialized ? dataStore.getBids().slice(0, 5) : []

  return (
    <div className="space-y-6">
{/* Welcome Section */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
  <div className="xl:col-span-2 bg-primary rounded-lg p-4 md:p-6 text-primary-foreground">
    <h1 className="text-xl md:text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
    <p className="text-primary-foreground/80 mb-4 text-sm md:text-base">Monitor and manage the FleetConnect platform</p>
    <div className="flex items-center space-x-6">
      <div className="flex items-center text-primary-foreground/80">
        <Shield className="h-4 w-4 mr-2" />
        <span className="font-medium text-sm md:text-base">Admin Access</span>
      </div>
      <div className="flex items-center text-primary-foreground/80">
        <Users className="h-4 w-4 mr-2" />
        <span className="font-medium text-sm md:text-base">Full Control</span>
      </div>
    </div>
  </div>
  
  {/* Admin Profile Card */}
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center text-base md:text-lg">
        <Users className="mr-2 h-4 w-4 md:h-5 md:w-5 text-primary" />
        Admin Profile
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="grid grid-cols-1 gap-2">
        <div className="flex justify-between items-center">
          <p className="text-xs md:text-sm text-muted-foreground">Name</p>
          <p className="font-medium text-foreground text-xs md:text-sm">{currentUser?.name || 'Admin User'}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs md:text-sm text-muted-foreground">Role</p>
          <p className="font-medium text-primary text-xs md:text-sm">System Admin</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs md:text-sm text-muted-foreground">Permissions</p>
          <p className="font-medium text-primary text-xs md:text-sm">Full Access</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs md:text-sm text-muted-foreground">Last Login</p>
          <p className="font-medium text-foreground text-xs md:text-sm">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </CardContent>
  </Card>
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
            <div className="text-2xl font-bold text-primary">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Recent Requirements</CardTitle>
            <CardDescription className="text-sm">Latest delivery requirements posted on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequirements.map((requirement) => (
                <div key={requirement.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm md:text-base">{requirement.title}</h4>
                    <div className="flex flex-wrap items-center text-xs md:text-sm text-muted-foreground space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span>{requirement.location}</span>
                      <span>•</span>
                      <span>{requirement.quantity} riders</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-sm md:text-base font-medium text-primary">{formatCurrency(requirement.ratePerHour)}/hr</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{formatDateTime(requirement.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bids */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Recent Bids</CardTitle>
            <CardDescription className="text-sm">Latest bids submitted by suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBids.map((bid) => (
                <div key={bid.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm md:text-base">{bid.supplierName}</h4>
                    <div className="flex flex-wrap items-center text-xs md:text-sm text-muted-foreground space-x-2">
                      <span>{bid.quantity} riders</span>
                      <span>•</span>
                      <span className="capitalize">{bid.fulfillmentType}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex flex-col sm:items-end space-y-1">
                    <div className="text-sm md:text-base font-medium text-primary">{formatCurrency(bid.proposedRate)}/hr</div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full inline-block ${bid.status === "accepted"
                          ? "bg-status-completed text-status-completed-foreground"
                          : bid.status === "rejected"
                            ? "bg-status-cancelled text-status-cancelled-foreground"
                            : "bg-status-bidding text-status-bidding-foreground"
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
              <Users className="mr-2 h-5 w-5 text-secondary" />
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
              <FileText className="mr-2 h-5 w-5 text-secondary" />
              Monitor Requirements
            </CardTitle>
            <CardDescription>Track all delivery requirements and their status</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/admin/system")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-accent" />
              System Health
            </CardTitle>
            <CardDescription>Monitor platform performance and health</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
