'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockRequirements, mockBids } from '@/lib/data/mockData'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { DashboardStats } from '@/lib/types'
import { 
  Search, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  MapPin,
  Calendar,
  Star,
  Target
} from 'lucide-react'

export default function SupplierDashboard() {
  const { state, dispatch } = useApp()
  const router = useRouter()
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
    // Load mock data
    dispatch({ type: 'SET_REQUIREMENTS', payload: mockRequirements })
    dispatch({ type: 'SET_BIDS', payload: mockBids })

    // Calculate stats for supplier
    const supplierBids = mockBids.filter(bid => bid.supplierId === state.currentUser?.id)
    const availableRequirements = mockRequirements.filter(req => 
      ['pending', 'bidding'].includes(req.status)
    )

    setStats({
      totalRequirements: availableRequirements.length,
      activeRequirements: availableRequirements.length,
      completedRequirements: 0,
      totalBids: supplierBids.length,
      acceptedBids: supplierBids.filter(bid => bid.status === 'accepted').length,
      totalRiders: 85, // Mock data
      activeRiders: 67, // Mock data
      averageRating: state.currentUser?.reliabilityScore || 4.5,
      totalRevenue: 125000, // Mock data
      fulfillmentRate: 92,
    })
  }, [dispatch, state.currentUser?.id, state.currentUser?.reliabilityScore])

  const availableRequirements = state.requirements
    .filter(req => ['pending', 'bidding'].includes(req.status))
    .slice(0, 3)

  const myRecentBids = state.bids
    .filter(bid => bid.supplierId === state.currentUser?.id)
    .slice(0, 3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg p-6 text-[hsl(var(--primary-foreground))]" style={{background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--ring)) 100%)'}}>
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {state.currentUser?.name}!
        </h1>
        <p className="text-[hsl(var(--primary-foreground))] mb-4">
          Find new opportunities and manage your fleet efficiently
        </p>
        <div className="flex items-center space-x-4">
          <Button 
            className="bg-[hsl(var(--primary-foreground))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-foreground))]/90"
            onClick={() => router.push('/supplier/browse')}
          >
            <Search className="mr-2 h-4 w-4" />
            Browse Requirements
          </Button>
          <div className="flex items-center text-[hsl(var(--primary-foreground))]">
            <Star className="h-4 w-4 mr-1" />
            <span className="font-medium">{stats.averageRating}</span>
            <span className="ml-1">Rating</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                variant="outline"
                onClick={() => router.push('/supplier/browse')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {availableRequirements.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No requirements available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Check back later for new opportunities.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableRequirements.map((requirement) => (
                  <div
                    key={requirement.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/supplier/browse/${requirement.id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{requirement.title}</h4>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(requirement.ratePerHour)}/hr
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
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
                variant="outline"
                onClick={() => router.push('/supplier/bids')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {myRecentBids.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bids yet</h3>
                <p className="mt-1 text-sm text-gray-500">
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
                  const requirement = state.requirements.find(r => r.id === bid.requirementId)
                  return (
                    <div key={bid.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {requirement?.title || 'Unknown Requirement'}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                          {bid.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {bid.quantity} riders
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">{formatCurrency(bid.proposedRate)}/hr</span>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/supplier/browse')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-blue-600" />
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
              <Users className="mr-2 h-5 w-5 text-green-600" />
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
              <FileText className="mr-2 h-5 w-5 text-orange-600" />
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
