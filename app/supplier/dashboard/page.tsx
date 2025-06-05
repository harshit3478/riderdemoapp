'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFleetAuth } from '@/contexts/FleetAuthContext'
import { useDataStore } from '@/hooks/useDataStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime, generateId } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'
import { DashboardStats, Requirement, Bid } from '@/lib/types'
import {
  Search,
  FileText,
  Users,
  Clock,
  MapPin,
  Calendar,
  Star,
  Target,
  X,
  IndianRupeeIcon
} from 'lucide-react'

export default function SupplierDashboard() {
  const router = useRouter()
  const { user: currentUser } = useFleetAuth()
  const { dataStore, isInitialized } = useDataStore()
  const { toast } = useToast()
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
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    fulfillmentType: 'partial' as 'full' | 'partial',
    quantity: '',
    proposedRate: '',
    message: ''
  })

  // useEffect(() => {
  //   console.log(selectedRequirement);
  //   console.log("showBidForm :", showBidForm);
  // }, [selectedRequirement])

  useEffect(() => {
    if (selectedRequirement) {
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
  }, [selectedRequirement])

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

  const handleOpenBidForm = () => {
    setShowBidForm(true)
  }

  const handleBackToDetails = () => {
    setShowBidForm(false)
    setBidData({
      fulfillmentType: 'partial',
      quantity: '',
      proposedRate: '',
      message: ''
    })
  }
  const handleCloseModal = () => {
    setSelectedRequirement(null)
    setShowBidForm(false)
    setBidData({
      fulfillmentType: 'partial',
      quantity: '',
      proposedRate: '',
      message: ''
    })
  }

  const handleBidSubmit = async (requirement: Requirement) => {
    if (!currentUser || !bidData.quantity || !bidData.proposedRate) return

    try {
      // Create new bid
      const newBid: Bid = {
        id: generateId(),
        requirementId: requirement.id,
        supplierId: currentUser.id,
        supplierName: currentUser.company || currentUser.name,
        fulfillmentType: bidData.fulfillmentType,
        quantity: parseInt(bidData.quantity),
        proposedRate: parseInt(bidData.proposedRate),
        message: bidData.message,
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Add bid to data store
      dataStore.addBid(newBid)

      // Reset form and close modal
      setBidData({
        fulfillmentType: 'partial',
        quantity: '',
        proposedRate: '',
        message: ''
      })
      setSelectedRequirement(null)
      setShowBidForm(false)
      // Show success message
      toast({
        title: "Success!",
        description: "Your bid has been submitted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit bid. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">

      {/* Welcome Section */}
      <div className="rounded-lg p-4 sm:p-6 bg-primary text-primary-foreground relative overflow-hidden">
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
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-primary-foreground mb-4 text-sm sm:text-base">
            Find new opportunities and manage your fleet efficiently
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              variant="contrast"
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

              <div>
                <div className="space-y-4">
                  {availableRequirements.map((requirement) => (
                    <div
                      key={requirement.id}
                      className="p-4 sm:p-6 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedRequirement(requirement);
                        setShowBidForm(false);
                      }}
                    >
                      <div className="mb-3 sm:mb-4">
                        <h4 className="font-medium text-foreground text-base sm:text-lg">{requirement.title}</h4>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center">
                          <IndianRupeeIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span className='text-primary'>{formatCurrency(requirement.ratePerHour)}/hr</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{requirement.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{requirement.quantity} riders</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{formatDateTime(requirement.startDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedRequirement && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-[95vw] sm:max-w-3xl max-h-[96vh] pb-4 overflow-hidden bg-card/95 backdrop-blur-sm border-border  shadow-2xl">
                      {!showBidForm ? (
                        <>
                          {/* Header with Close and Submit buttons */}
                          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 border-b">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-foreground">
                                {selectedRequirement.title}
                              </CardTitle>
                              <CardDescription className="text-muted-foreground mt-1">
                                {selectedRequirement.buyerCompany}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                onClick={handleOpenBidForm}
                                size="sm"
                                className="px-4"
                              >
                                Submit Bid
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
                            {selectedRequirement.description && (
                              <div>
                                <h4 className="text-sm font-medium text-foreground mb-1">Description</h4>
                                <p className="text-sm text-muted-foreground">{selectedRequirement.description}</p>
                              </div>
                            )}

                            {/* Key Details Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="text-center p-2 rounded-lg border">
                                {/* <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" /> */}
                                <div className="text-sm font-medium">{selectedRequirement.quantity}</div>
                                <div className="text-xs text-muted-foreground ">Riders</div>
                              </div>
                              <div className="text-center p-2 rounded-lg border">
                                <span className="text-sm font-medium text-primary">{formatCurrency(selectedRequirement.ratePerHour)}</span>
                                <div className="text-xs text-muted-foreground ">Per Hour</div>
                              </div>
                              <div className="text-center p-2 rounded-lg border">
                                <MapPin className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                                <div className="text-xs text-muted-foreground ">{selectedRequirement.location}</div>
                              </div>
                              <div className="flex justify-center items-center p-2 rounded-lg border">
                                <div className='text-center w-auto h-auto'>
                                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize
                                  ${selectedRequirement.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      selectedRequirement.status === 'bidding' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'}`}>
                                    {selectedRequirement.status}
                                  </span>
                                  <div className="text-xs text-muted-foreground ">Status</div>
                                </div>

                              </div>
                            </div>

                            {/* Schedule */}
                            <div>
                              <h4 className="text-sm font-medium text-foreground mb-2">Schedule</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <div>
                                    <div className="font-medium">Start: {formatDateTime(selectedRequirement.startDate)}</div>
                                    <div className="text-xs">at {selectedRequirement.startTime}</div>
                                  </div>
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <div>
                                    <div className="font-medium">End: {formatDateTime(selectedRequirement.endDate)}</div>
                                    <div className="text-xs">at {selectedRequirement.endTime}</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Additional Info */}
                            {(selectedRequirement.language || selectedRequirement.pincode) && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {selectedRequirement.language && (
                                  <div>
                                    <span className="font-medium text-foreground">Language: </span>
                                    <span className="text-muted-foreground">{selectedRequirement.language}</span>
                                  </div>
                                )}
                                {selectedRequirement.pincode && (
                                  <div>
                                    <span className="font-medium text-foreground">Pincode: </span>
                                    <span className="text-muted-foreground">{selectedRequirement.pincode}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </>
                      ) : (
                        <>
                          {/* Bid Form Header */}
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
                            <div>
                              <CardTitle className="text-lg text-foreground">Submit Bid</CardTitle>
                              <CardDescription className="text-muted-foreground">
                                For: {selectedRequirement.title}
                              </CardDescription>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={handleCloseModal}
                              className="p-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </CardHeader>

                          {/* Bid Form Content */}
                          <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-foreground">Fulfillment Type</label>
                                <select
                                  className="w-full h-9 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm mt-1 focus:ring-2 focus:ring-ring focus:border-transparent"
                                  value={bidData.fulfillmentType}
                                  onChange={(e) => setBidData(prev => ({ ...prev, fulfillmentType: e.target.value as 'full' | 'partial' }))}
                                >
                                  <option value="partial">Partial Fulfillment</option>
                                  <option value="full">Full Fulfillment</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-foreground">
                                  Riders ({bidData.fulfillmentType === 'full' ? selectedRequirement.quantity : `max ${selectedRequirement.quantity}`})
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max={selectedRequirement.quantity}
                                  placeholder="Number of riders"
                                  value={bidData.quantity}
                                  onChange={(e) => setBidData(prev => ({ ...prev, quantity: e.target.value }))}
                                  className="w-full h-9 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm mt-1 focus:ring-2 focus:ring-ring focus:border-transparent"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-foreground">Proposed Rate per Hour (INR)</label>
                              <input
                                type="number"
                                min="1"
                                placeholder={`Suggested: ${selectedRequirement.ratePerHour}`}
                                value={bidData.proposedRate}
                                onChange={(e) => setBidData(prev => ({ ...prev, proposedRate: e.target.value }))}
                                className="w-full h-9 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm mt-1 focus:ring-2 focus:ring-ring focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium text-foreground">Message (Optional)</label>
                              <textarea
                                className="w-full h-20 px-3 py-2 border border-input bg-background text-foreground rounded-md text-sm mt-1 focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                                placeholder="Add any additional information..."
                                value={bidData.message}
                                onChange={(e) => setBidData(prev => ({ ...prev, message: e.target.value }))}
                              />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <Button
                                variant="outline"
                                onClick={handleBackToDetails}
                                size="sm"
                              >
                                Back
                              </Button>
                              <Button
                                onClick={() => handleBidSubmit(selectedRequirement)}
                                disabled={!bidData.quantity || !bidData.proposedRate}
                                size="sm"
                              >
                                Submit Bid
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
                  <Button onClick={() => router.push('/supplier/browse')}
                    variant="contrast">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Requirements
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {myRecentBids.map((bid) => {
                  const requirements = dataStore.getRequirements();
                  const requirement = requirements.find((r) => r.id === bid.requirementId);
                  return (
                    <div key={bid.id} className="p-4 sm:p-6 border border-border rounded-lg">
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground text-base sm:text-lg">
                            {requirement?.title || 'Unknown Requirement'}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bid.status)}`}>
                            {bid.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{bid.quantity} riders</span>
                        </div>
                        <div className="flex items-center">
                          <IndianRupeeIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span className="font-medium text-primary">{formatCurrency(bid.proposedRate)}/hr</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{formatDateTime(bid.createdAt)}</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/supplier/browse')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5 text-secondary" />
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
              <FileText className="mr-2 h-5 w-5 text-secondary" />
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
