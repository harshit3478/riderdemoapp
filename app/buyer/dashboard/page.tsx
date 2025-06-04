"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCompanyAuth } from "@/hooks/useCompanyAuth"
import { useDataStore } from "@/hooks/useDataStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import type { DashboardStats, Requirement } from "@/lib/types"
import {
  Plus,
  FileText,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react"

export default function BuyerDashboard() {
  const router = useRouter()
  const { user: currentUser, isAuthenticated } = useCompanyAuth()
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
  const [recentRequirements, setRecentRequirements] = useState<Requirement[]>([])

  const loadData = useCallback(async () => {
    if (!isInitialized) return
    
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Get data from store
      const requirements = dataStore.getRequirements()
      const bids = dataStore.getBids()

      // Filter for current buyer
      const buyerRequirements = requirements.filter((req) => req.buyerId === currentUser?.id)
      const totalBids = bids.filter((bid) => buyerRequirements.some((req) => req.id === bid.requirementId))

      setStats({
        totalRequirements: buyerRequirements.length,
        activeRequirements: buyerRequirements.filter((req) => ["pending", "bidding", "matched"].includes(req.status))
          .length,
        completedRequirements: buyerRequirements.filter((req) => req.status === "completed").length,
        totalBids: totalBids.length,
        acceptedBids: totalBids.filter((bid) => bid.status === "accepted").length,
        totalRiders: 0,
        activeRiders: 0,
        averageRating: 4.5,
        totalRevenue: 0,
        fulfillmentRate: 85,
      })

      setRecentRequirements(buyerRequirements.slice(0, 3))
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.")
      console.error("Dashboard loading error:", err)
    } finally {
      setLoading(false)
    }
  }, [currentUser?.id, isInitialized, dataStore])

  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.type !== "buyer") {
      router.push("/buyer/login")
      return
    }
    loadData()
  }, [currentUser, isAuthenticated, router, loadData, isInitialized])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-status-pending text-status-pending-foreground"
      case "bidding":
        return "bg-status-active text-status-active-foreground"
      case "matched":
        return "bg-status-success text-status-success-foreground"
      case "confirmed":
        return "bg-status-success text-status-success-foreground"
      case "completed":
        return "bg-muted text-muted-foreground"
      case "cancelled":
        return "bg-status-error text-status-error-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (loading && recentRequirements.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-primary rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-primary-foreground/20 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-primary-foreground/20 rounded w-2/3 mb-4"></div>
            <div className="h-10 bg-primary-foreground/20 rounded w-48"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Something went wrong</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={loadData} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-primary rounded-lg p-6 text-primary-foreground relative overflow-hidden border border-border shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="text-primary-foreground/80 mb-4">
          Manage your delivery requirements and track fulfillment in real-time
        </p>
        <Button variant="secondary" onClick={() => router.push("/buyer/post-requirement")}>
          <Plus className="mr-2 h-4 w-4" />
          Post New Requirement
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBids}</div>
            <p className="text-xs text-muted-foreground">{stats.acceptedBids} accepted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfillment Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fulfillmentRate}%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">⭐ Excellent performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requirements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Requirements</CardTitle>
              <CardDescription>Your latest delivery requirements and their status</CardDescription>
            </div>
            <Button variant="default" onClick={() => router.push("/buyer/requirements")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentRequirements.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No requirements yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by posting your first delivery requirement.</p>
              <div className="mt-6">
                <Button onClick={() => router.push("/buyer/post-requirement")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Post Requirement
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRequirements.map((requirement) => (
                <div
                  key={requirement.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/buyer/requirements/${requirement.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{requirement.title}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}
                      >
                        {requirement.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {requirement.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {requirement.quantity} riders
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDateTime(requirement.startDate)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{formatCurrency(requirement.ratePerHour)}/hr</div>
                    <div className="text-sm text-muted-foreground">{requirement.bids?.length || 0} bids</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-border"
          onClick={() => router.push("/buyer/post-requirement")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5 text-primary" />
              Post Requirement
            </CardTitle>
            <CardDescription>Create a new delivery requirement for your business</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-border"
          onClick={() => router.push("/buyer/proposals")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-secondary" />
              Review Proposals
            </CardTitle>
            <CardDescription>Check and approve bids from fleet managers and riders</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-border"
          onClick={() => router.push("/buyer/requirements")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-warning" />
              Track Progress
            </CardTitle>
            <CardDescription>Monitor the status of your active requirements</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
