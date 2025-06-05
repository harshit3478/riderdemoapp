'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRiderAuth } from '@/hooks/useRiderAuth'
import { useDataStore } from '@/hooks/useDataStore'
import { formatCurrency, formatDateTime, generateId } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'
import { DashboardStats, Requirement, RiderApplication } from '@/lib/types'
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
  Target,
  X,
  ArrowLeft
} from 'lucide-react'

export default function RiderDashboard() {
  const router = useRouter()
  const { user: currentUser } = useRiderAuth()
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
  const [availableGigs, setAvailableGigs] = useState<Requirement[]>([])
  const [myRecentApplications, setMyRecentApplications] = useState<RiderApplication[]>([])
  const [selectedGig, setSelectedGig] = useState<Requirement | null>(null);
  const [showGigForm, setShowGigForm] = useState(false);
  const { toast } = useToast()
  useEffect(() => {
    if (selectedGig) {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh' // Ensure body takes full viewport height
      document.body.style.position = 'fixed' // Prevent scroll bounce on some browsers
      document.body.style.width = '100%' // Maintain full width
    } else {
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    // Cleanup on unmount or when modal closes
    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [selectedGig])

  const loadData = useCallback(async () => {
    if (!isInitialized || !currentUser) return

    try {
      setLoading(true)
      setError(null)

      // Get data from dataStore
      const requirements = dataStore.getRequirements()
      const riderApplications = dataStore.getRiderApplications()

      // Filter data for current rider
      const riderApps = riderApplications.filter((app: RiderApplication) => app.riderId === currentUser.id)
      const availableGigsData = requirements.filter((req: Requirement) =>
        ['pending', 'bidding'].includes(req.status) &&
        !riderApps.some((app: RiderApplication) => app.requirementId === req.id)
      )

      setStats({
        totalRequirements: availableGigsData.length,
        activeRequirements: availableGigsData.length,
        completedRequirements: riderApps.filter((app: RiderApplication) => app.status === 'completed').length,
        totalBids: riderApps.length,
        acceptedBids: riderApps.filter((app: RiderApplication) => app.status === 'confirmed').length,
        totalRiders: 0,
        activeRiders: 0,
        averageRating: currentUser?.reliabilityScore || 4.5,
        totalRevenue: 15750, // Mock data
        fulfillmentRate: 95,
      })

      setAvailableGigs(availableGigsData.slice(0, 3))
      setMyRecentApplications(riderApps.slice(0, 3))
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.")
      console.error("Dashboard loading error:", err)
    } finally {
      setLoading(false)
    }
  }, [currentUser?.id, isInitialized, dataStore])

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = parseInt(startTime.split(':')[0])
    const end = parseInt(endTime.split(':')[0])
    return end - start
  }
  const calculateEarnings = (gig: Requirement) => {
    const duration = calculateDuration(gig.startTime, gig.endTime)
    const days = Math.ceil((new Date(gig.endDate).getTime() - new Date(gig.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    return gig.ratePerHour * duration * days
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-status-bidding text-status-bidding-foreground'
      case 'confirmed': return 'bg-status-matched text-status-matched-foreground'
      case 'rejected': return 'bg-status-cancelled text-status-cancelled-foreground'
      case 'completed': return 'bg-status-completed text-status-completed-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const handleApply = async (gig: Requirement) => {
    if (!currentUser) return

    const newApplication: RiderApplication = {
      id: generateId(),
      riderId: currentUser.id,
      riderName: currentUser.name,
      requirementId: gig.id,
      location: gig.location,
      timeSlot: `${gig.startTime}-${gig.endTime}`,
      language: gig.language,
      status: 'applied',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Add the application using dataStore
    dataStore.addRiderApplication(newApplication)

    // Update requirement status to bidding if it was pending
    if (gig.status === 'pending') {
      dataStore.updateRequirement(gig.id, {
        status: 'bidding',
        updatedAt: new Date()
      })
    }

    setSelectedGig(null)

    // Show success message using toast
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully!",
    })
  }

  const handleOpenGigForm = () => {
    setShowGigForm(true)
  }

  const handleBackToDetails = () => {
    setShowGigForm(false)
  }
  const handleCloseModal = () => {
    setSelectedGig(null)
    setShowGigForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      {/* TODO: Add hero-image-rider.png from Figma design as background */}
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-lg p-6 text-primary-foreground relative overflow-hidden ">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'url(/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Content - positioned above the overlay */}
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-primary-foreground/80 mb-4">
            Find flexible gig opportunities and grow your earnings
          </p>
          <div className="flex items-center space-x-4">
            <Button
              variant="contrast"
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
                variant="default"
                onClick={() => router.push('/rider/gigs')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {availableGigs.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No gigs available</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Check back later for new opportunities.
                </p>
              </div>
            ) : (
              <div>
                <div className="space-y-4">
                  {availableGigs.map((gig) => (
                    <div
                      key={gig.id}
                      className="p-4 sm:p-6 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedGig(gig);
                        setShowGigForm(false);
                      }}
                    >
                      <div className="mb-3 sm:mb-4">
                        <h4 className="font-medium text-foreground text-base sm:text-lg">{gig.title}</h4>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span className='text-primary'>{formatCurrency(gig.ratePerHour)}/hr</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{gig.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{gig.startTime} - {gig.endTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{formatDateTime(gig.startDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedGig && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-[95vw] sm:max-w-3xl max-h-[96vh] pb-4 overflow-hidden bg-card/95 backdrop-blur-sm border-border shadow-2xl">
                      {!showGigForm ? (
                        <>
                          {/* Header with Close and Submit buttons */}
                          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 border-b">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-foreground">
                                {selectedGig.title}
                              </CardTitle>
                              <CardDescription className="text-muted-foreground mt-1">
                                {selectedGig.buyerCompany}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                onClick={handleOpenGigForm}
                                size="sm"
                                className="px-4"
                              >
                                Apply
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleCloseModal}
                                className="p-2"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          {/* Compact Content */}
                          <CardContent className="p-4 space-y-4">
                            {selectedGig.description && (
                              <div>
                                <h4 className="text-sm font-medium text-foreground mb-1">Description</h4>
                                <p className="text-sm text-muted-foreground">{selectedGig.description}</p>
                              </div>
                            )}

                            {/* Key Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                              <div className="text-center p-2 rounded-lg border">
                                {/* <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" /> */}
                                <div className="text-sm font-medium">{selectedGig.quantity}</div>
                                <div className="text-xs text-muted-foreground">Riders</div>
                              </div>
                              <div className="text-center p-2 rounded-lg border">
                                <span className="text-sm font-medium text-primary">{formatCurrency(selectedGig.ratePerHour)}</span>
                                <div className="text-xs text-muted-foreground">Per Hour</div>
                              </div>
                              <div className="text-center p-2 rounded-lg border">
                                <MapPin className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                                <div className="text-xs text-muted-foreground">{selectedGig.location}</div>
                              </div>
                            </div>

                            {/* Schedule */}
                            <div>
                              <h4 className="text-sm font-medium text-foreground mb-2">Schedule</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <div>
                                    <div className="font-medium">Start: {formatDateTime(selectedGig.startDate)}</div>
                                    <div className="text-xs">at {selectedGig.startTime}</div>
                                  </div>
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <div>
                                    <div className="font-medium">End: {formatDateTime(selectedGig.endDate)}</div>
                                    <div className="text-xs">at {selectedGig.endTime}</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Additional Info */}
                            {(selectedGig.language || selectedGig.pincode) && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {selectedGig.language && (
                                  <div>
                                    <span className="font-medium text-foreground">Language: </span>
                                    <span className="text-muted-foreground">{selectedGig.language}</span>
                                  </div>
                                )}
                                {selectedGig.pincode && (
                                  <div>
                                    <span className="font-medium text-foreground">Pincode: </span>
                                    <span className="text-muted-foreground">{selectedGig.pincode}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </>
                      ) : (
                        // Application Form - replaces the content within the same modal
                        <>
                          <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">Apply for Gig</CardTitle>
                                <CardDescription className="mt-1">
                                  Confirm your application for: {selectedGig.title}
                                </CardDescription>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowGigForm(false)}
                                className="p-2"
                              >
                                <ArrowLeft className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>

                          <CardContent className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="bg-muted p-4 rounded-lg space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Location:</span>
                                <span className="text-sm font-medium text-foreground">{selectedGig.location}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Time:</span>
                                <span className="text-sm font-medium text-foreground">{selectedGig.startTime} - {selectedGig.endTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Date:</span>
                                <span className="text-sm font-medium text-foreground">{formatDateTime(selectedGig.startDate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Rate:</span>
                                <span className="text-sm font-medium text-primary">{formatCurrency(selectedGig.ratePerHour)}/hr</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Potential Earnings:</span>
                                <span className="text-sm font-semibold text-secondary">{formatCurrency(calculateEarnings(selectedGig))}</span>
                              </div>
                              {selectedGig.language && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Language:</span>
                                  <span className="text-sm font-medium text-foreground">{selectedGig.language}</span>
                                </div>
                              )}
                            </div>

                            <div className="bg-secondary/20 p-4 rounded-lg">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-secondary mr-2" />
                                <span className="text-sm text-secondary-foreground font-medium">
                                  Your Rating: {currentUser?.reliabilityScore || 4.5}/5.0
                                </span>
                              </div>
                              <p className="text-xs text-secondary-foreground mt-1">
                                Maintain high ratings to get priority for future gigs!
                              </p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedGig(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleApply(selectedGig)}
                                className="min-w-[140px]"
                              >
                                Confirm Application
                              </Button>
                            </div>
                          </CardContent>
                        </>
                      )}
                    </Card>
                  </div>
                )}
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
                variant="default"
                onClick={() => router.push('/rider/applications')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {myRecentApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No applications yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start applying for gigs to see them here.
                </p>
                <div className="mt-6">
                  <Button onClick={() => router.push('/rider/gigs')}
                    variant="contrast">
                    <Search className="mr-2 h-4 w-4" />
                    Find Gigs
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {myRecentApplications.map((application) => {
                  const requirements = dataStore.getRequirements();
                  const gig = requirements.find((r) => r.id === application.requirementId);
                  return (
                    <div key={application.id} className="p-4 sm:p-6 border border-border rounded-lg">
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground text-base sm:text-lg">
                            {gig?.title || 'Unknown Gig'}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{application.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{application.timeSlot}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{formatDateTime(application.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
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
              <Search className="mr-2 h-5 w-5 text-secondary" />
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
              <FileText className="mr-2 h-5 w-5 text-secondary" />
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
              <Star className="mr-2 h-5 w-5 text-accent" />
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
              <div className="text-2xl font-bold text-secondary">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div className="text-sm text-muted-foreground">Total Earnings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {stats.completedRequirements}
              </div>
              <div className="text-sm text-muted-foreground">Completed Gigs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {stats.averageRating}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {stats.fulfillmentRate}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
