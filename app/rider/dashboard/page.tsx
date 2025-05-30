'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockRequirements, mockRiderApplications } from '@/lib/data/mockData'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { DashboardStats } from '@/lib/types'
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  Star,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Target
} from 'lucide-react'

export default function RiderDashboard() {
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
  const [availableGigs, setAvailableGigs] = useState<typeof mockRequirements>([])
  const [myRecentApplications, setMyRecentApplications] = useState<typeof mockRiderApplications>([])

  useEffect(() => {
    // Calculate stats for rider using mock data
    const riderApplications = mockRiderApplications.filter(app => app.riderId === currentUser?.id)
    const availableGigsData = mockRequirements.filter(req =>
      ['pending', 'bidding'].includes(req.status)
    )

    setStats({
      totalRequirements: availableGigsData.length,
      activeRequirements: availableGigsData.length,
      completedRequirements: riderApplications.filter(app => app.status === 'completed').length,
      totalBids: riderApplications.length,
      acceptedBids: riderApplications.filter(app => app.status === 'confirmed').length,
      totalRiders: 0,
      activeRiders: 0,
      averageRating: currentUser?.reliabilityScore || 4.5,
      totalRevenue: 15750, // Mock data
      fulfillmentRate: 95,
    })

    setAvailableGigs(availableGigsData.slice(0, 3))
    setMyRecentApplications(riderApplications.slice(0, 3))
  }, [currentUser?.id, currentUser?.reliabilityScore])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      {/* TODO: Add hero-image-rider.png from Figma design as background */}
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-lg p-6 text-primary-foreground relative overflow-hidden">
        {/* TODO: Add rider dashboard illustration from Figma */}
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {currentUser?.name}!
        </h1>
        <p className="text-primary-foreground/80 mb-4">
          Find flexible gig opportunities and grow your earnings
        </p>
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => router.push('/rider/gigs')}
          >
            <Search className="mr-2 h-4 w-4" />
            Find Gigs
          </Button>
          <div className="flex items-center text-primary-foreground/80">
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
            <CardTitle className="text-sm font-medium">Available Gigs</CardTitle>
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
            <CardTitle className="text-sm font-medium">My Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBids}</div>
            <p className="text-xs text-muted-foreground">
              {stats.acceptedBids} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              This month
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
              Completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Gigs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Available Gigs</CardTitle>
                <CardDescription>
                  New delivery opportunities near you
                </CardDescription>
              </div>
              <Button 
                variant="outline"
                onClick={() => router.push('/rider/gigs')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {availableGigs.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No gigs available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Check back later for new opportunities.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableGigs.map((gig) => (
                  <div
                    key={gig.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/rider/gigs/${gig.id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{gig.title}</h4>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(gig.ratePerHour)}/hr
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {gig.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {gig.startTime} - {gig.endTime}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDateTime(gig.startDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Recent Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>
                  Track the status of your gig applications
                </CardDescription>
              </div>
              <Button 
                variant="outline"
                onClick={() => router.push('/rider/applications')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {myRecentApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start applying for gigs to see them here.
                </p>
                <div className="mt-6">
                  <Button onClick={() => router.push('/rider/gigs')}>
                    <Search className="mr-2 h-4 w-4" />
                    Find Gigs
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {myRecentApplications.map((application) => {
                  const gig = mockRequirements.find(r => r.id === application.requirementId)
                  return (
                    <div key={application.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {gig?.title || 'Unknown Gig'}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {application.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {application.timeSlot}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDateTime(application.createdAt)}
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
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/rider/gigs')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-blue-600" />
              Find Gigs
            </CardTitle>
            <CardDescription>
              Browse available delivery opportunities
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/rider/applications')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-green-600" />
              My Applications
            </CardTitle>
            <CardDescription>
              Track your gig applications and status
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/rider/profile')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-orange-600" />
              My Profile
            </CardTitle>
            <CardDescription>
              Manage your profile and ratings
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Earnings Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Earnings Overview
          </CardTitle>
          <CardDescription>
            Your earnings and performance this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div className="text-sm text-gray-500">Total Earnings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.completedRequirements}
              </div>
              <div className="text-sm text-gray-500">Completed Gigs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.averageRating}
              </div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.fulfillmentRate}%
              </div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
