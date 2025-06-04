'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFleetAuth } from '@/hooks/useFleetAuth'
import { useDataStore } from '@/hooks/useDataStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { DashboardStats, Requirement, Bid } from '@/lib/types'
import {
  Search,
  FileText,
  Users,
  Clock,
  MapPin,
  Calendar,
  Star,
  Target
} from 'lucide-react'

export default function SupplierDashboard() {
  const router = useRouter()
  const { user: currentUser } = useFleetAuth()
  const { dataStore, isInitialized } = useDataStore()
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
  const [availableRequirements, setAvailableRequirements] = useState<Requirement[]>([])
  const [myRecentBids, setMyRecentBids] = useState<Bid[]>([])

  useEffect(() => {
    if (!currentUser || !isInitialized) return

    // Calculate stats for supplier using data store
    const requirements = dataStore.getRequirements()
    const bids = dataStore.getBids()
    const supplierBids = bids.filter((bid: Bid) => bid.supplierId === currentUser.id)
    const availableReqs = requirements.filter((req: Requirement) =>
      ['pending', 'bidding'].includes(req.status)
    )

    setStats({
      totalRequirements: availableReqs.length,
      activeRequirements: availableReqs.length,
      completedRequirements: 0,
      totalBids: supplierBids.length,
      acceptedBids: supplierBids.filter((bid: Bid) => bid.status === 'accepted').length,
      totalRiders: 85, // Mock data
      activeRiders: 67, // Mock data
      averageRating: currentUser?.reliabilityScore || 4.5,
      totalRevenue: 125000, // Mock data
      fulfillmentRate: 92,
    })

    setAvailableRequirements(availableReqs.slice(0, 3))
    setMyRecentBids(supplierBids.slice(0, 3))
  }, [currentUser, isInitialized, dataStore])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-status-active text-status-active-foreground border-status-active'
      case 'accepted': return 'bg-status-success text-status-success-foreground border-status-success'
      case 'rejected': return 'bg-status-error text-status-error-foreground border-status-error'
      case 'expired': return 'bg-muted text-muted-foreground border-border'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg p-4 sm:p-6 bg-primary text-primary-foreground">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          Welcome back, {currentUser?.name}!
        </h1>
        <p className="text-primary-foreground mb-4 text-sm sm:text-base">
          Find new opportunities and manage your fleet efficiently
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push('/supplier/browse')}
            className="w-full sm:w-auto"
          >
            <Search className="mr-2 h-4 w-4" />
            Browse Requirements
          </Button>
          <div className="flex items-center text-primary-foreground justify-center sm:justify-start">
            <Star className="h-4 w-4 mr-1 text-warning" />
            <span className="font-medium">{stats.averageRating}</span>
            <span className="ml-1">Rating</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Requirements</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequirements}</div>
            <p className="text-xs text-muted-foreground">
              New opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Bids</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBids}</div>
            <p className="text-xs text-muted-foreground">
              {stats.acceptedBids} accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Riders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRiders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeRiders} active today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fulfillmentRate}%</div>
            <p className="text-xs text-muted-foreground">
              Fulfillment rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Requirements */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Available Requirements</CardTitle>
                <CardDescription>
                  New opportunities matching your capabilities
                </CardDescription>
              </div>
              <Button 
                variant="default"
                onClick={() => router.push('/supplier/browse')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {availableRequirements.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No requirements available</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Check back later for new opportunities.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableRequirements.map((requirement) => (
                  <div
                    key={requirement.id}
                    className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/supplier/browse/${requirement.id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{requirement.title}</h4>
                      <span className="text-sm font-semibold text-primary">
                        {formatCurrency(requirement.ratePerHour)}/hr
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Recent Bids */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Recent Bids</CardTitle>
                <CardDescription>
                  Track the status of your submitted bids
                </CardDescription>
              </div>
              <Button 
                variant="default"
                onClick={() => router.push('/supplier/bids')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {myRecentBids.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No bids yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start bidding on requirements to see them here.
                </p>
                <div className="mt-6">
                  <Button onClick={() => router.push('/supplier/browse')}>
                    <Search className="mr-2 h-4 w-4" />
                    Browse Requirements
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {myRecentBids.map((bid) => {
                  const requirements = dataStore.getRequirements()
                  const requirement = requirements.find((r: Requirement) => r.id === bid.requirementId)
                  return (
                    <div key={bid.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">
                          {requirement?.title || 'Unknown Requirement'}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bid.status)}`}>
                          {bid.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {bid.quantity} riders
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-primary">{formatCurrency(bid.proposedRate)}/hr</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDateTime(bid.createdAt)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/supplier/browse')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-primary" />
              Browse Requirements
            </CardTitle>
            <CardDescription>
              Find new delivery requirements to bid on
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/supplier/riders')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-secondary" />
              Manage Riders
            </CardTitle>
            <CardDescription>
              View and manage your fleet of riders
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/supplier/bids')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-warning" />
              Track Bids
            </CardTitle>
            <CardDescription>
              Monitor the status of all your bids
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
