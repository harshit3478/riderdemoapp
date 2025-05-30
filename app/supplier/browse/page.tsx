'use client'

import { useState, useEffect } from 'react'
import { useDriverAuth } from '@/hooks/useDriverAuth'
import { useDataStore } from '@/hooks/useDataStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDateTime, generateId } from '@/lib/utils'
import { Requirement, Bid } from '@/lib/types'
import { useToast } from '@/lib/hooks/use-toast'
import {
  Search,
  MapPin,
  Users,
  Calendar,
  Clock,
  Send,
  Eye
} from 'lucide-react'

export default function BrowseRequirements() {
  const { user: currentUser } = useDriverAuth()
  const { dataStore, isInitialized } = useDataStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [filteredRequirements, setFilteredRequirements] = useState<Requirement[]>([])
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null)
  const [bidData, setBidData] = useState({
    fulfillmentType: 'partial' as 'full' | 'partial',
    quantity: '',
    proposedRate: '',
    message: ''
  })

  useEffect(() => {
    if (!isInitialized) return

    // Get requirements from data store and filter available ones
    const allRequirements = dataStore.getRequirements()
    let requirements = allRequirements.filter((req: Requirement) =>
      ['pending', 'bidding'].includes(req.status)
    )

    // Apply search filter
    if (searchTerm) {
      requirements = requirements.filter((req: Requirement) =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply location filter
    if (locationFilter) {
      requirements = requirements.filter((req: Requirement) => req.location === locationFilter)
    }

    // Sort by creation date (newest first)
    requirements.sort((a: Requirement, b: Requirement) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredRequirements(requirements)
  }, [searchTerm, locationFilter, isInitialized, dataStore])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-status-pending text-status-pending-foreground border-status-pending'
      case 'bidding': return 'bg-status-active text-status-active-foreground border-status-active'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  // Get unique locations from requirements for filter
  const getUniqueLocations = () => {
    const allRequirements = dataStore.getRequirements()
    const locations = allRequirements.map((req: Requirement) => req.location)
    return [...new Set(locations)].sort()
  }

  // Check if current supplier has already submitted a bid for a requirement
  const hasSubmittedBid = (requirementId: string) => {
    if (!currentUser || !isInitialized) return false
    const allBids = dataStore.getBids()
    return allBids.some((bid: Bid) =>
      bid.requirementId === requirementId &&
      bid.supplierId === currentUser.id
    )
  }

  // Get the bid status for a requirement
  const getBidForRequirement = (requirementId: string) => {
    if (!currentUser || !isInitialized) return null
    const allBids = dataStore.getBids()
    return allBids.find((bid: Bid) =>
      bid.requirementId === requirementId &&
      bid.supplierId === currentUser.id
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Browse Requirements</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Find delivery requirements that match your fleet capabilities</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requirements..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full h-9 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {isInitialized && getUniqueLocations().map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements List */}
      {filteredRequirements.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No requirements found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters, or check back later for new opportunities.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequirements.map((requirement) => (
            <Card key={requirement.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{requirement.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border w-fit ${getStatusColor(requirement.status)}`}>
                        {requirement.status}
                      </span>
                    </div>
                    {requirement.description && (
                      <p className="text-muted-foreground text-sm mb-3">{requirement.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {(() => {
                      const existingBid = getBidForRequirement(requirement.id)
                      const hasBid = hasSubmittedBid(requirement.id)

                      if (hasBid && existingBid) {
                        return (
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              existingBid.status === 'accepted'
                                ? 'bg-status-completed text-status-completed-foreground border-status-completed'
                                : existingBid.status === 'rejected'
                                  ? 'bg-status-cancelled text-status-cancelled-foreground border-status-cancelled'
                                  : 'bg-status-bidding text-status-bidding-foreground border-status-bidding'
                            }`}>
                              Bid {existingBid.status}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Show bid details or allow editing
                                setBidData({
                                  fulfillmentType: existingBid.fulfillmentType,
                                  quantity: existingBid.quantity.toString(),
                                  proposedRate: existingBid.proposedRate.toString(),
                                  message: existingBid.message || ''
                                })
                                setSelectedRequirement(requirement)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Bid
                            </Button>
                          </div>
                        )
                      } else {
                        return (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRequirement(requirement)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Submit Bid
                          </Button>
                        )
                      }
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{requirement.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{requirement.quantity} riders needed</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDateTime(requirement.startDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{requirement.startTime} - {requirement.endTime}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div>
                      <span className="text-sm text-muted-foreground">Rate:</span>
                      <span className="ml-1 font-semibold text-primary">
                        {formatCurrency(requirement.ratePerHour)}/hr
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Value:</span>
                      <span className="ml-1 font-semibold text-secondary">
                        {formatCurrency(requirement.ratePerHour * requirement.quantity *
                          ((new Date(requirement.endDate).getTime() - new Date(requirement.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1) *
                          (parseInt(requirement.endTime.split(':')[0]) - parseInt(requirement.startTime.split(':')[0]))
                        )}
                      </span>
                    </div>
                    {requirement.language && (
                      <div>
                        <span className="text-sm text-muted-foreground">Language:</span>
                        <span className="ml-1 font-medium text-foreground">{requirement.language}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Posted {formatDateTime(requirement.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bid Modal */}
      {selectedRequirement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border shadow-2xl">
            <CardHeader>
              <CardTitle className="text-foreground">
                {getBidForRequirement(selectedRequirement.id) ? 'View Bid Details' : 'Submit Bid'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {getBidForRequirement(selectedRequirement.id) ? 'Your bid for:' : 'Bid for:'} {selectedRequirement.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Fulfillment Type</label>
                <select
                  className="w-full h-9 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm mt-1 focus:ring-2 focus:ring-ring focus:border-transparent"
                  value={bidData.fulfillmentType}
                  onChange={(e) => setBidData(prev => ({ ...prev, fulfillmentType: e.target.value as 'full' | 'partial' }))}
                  disabled={!!getBidForRequirement(selectedRequirement.id)}
                >
                  <option value="partial">Partial Fulfillment</option>
                  <option value="full">Full Fulfillment</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Number of Riders ({bidData.fulfillmentType === 'full' ? selectedRequirement.quantity : `max ${selectedRequirement.quantity}`})
                </label>
                <Input
                  type="number"
                  min="1"
                  max={selectedRequirement.quantity}
                  placeholder="Enter number of riders"
                  value={bidData.quantity}
                  onChange={(e) => setBidData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="mt-1"
                  disabled={!!getBidForRequirement(selectedRequirement.id)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Proposed Rate per Hour (INR)</label>
                <Input
                  type="number"
                  min="1"
                  placeholder={`Suggested: ${selectedRequirement.ratePerHour}`}
                  value={bidData.proposedRate}
                  onChange={(e) => setBidData(prev => ({ ...prev, proposedRate: e.target.value }))}
                  className="mt-1"
                  disabled={!!getBidForRequirement(selectedRequirement.id)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Message (Optional)</label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-foreground rounded-md text-sm mt-1 focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  placeholder="Add any additional information about your bid..."
                  value={bidData.message}
                  onChange={(e) => setBidData(prev => ({ ...prev, message: e.target.value }))}
                  disabled={!!getBidForRequirement(selectedRequirement.id)}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setSelectedRequirement(null)
                    setBidData({
                      fulfillmentType: 'partial',
                      quantity: '',
                      proposedRate: '',
                      message: ''
                    })
                  }}
                >
                  {getBidForRequirement(selectedRequirement.id) ? 'Close' : 'Cancel'}
                </Button>
                {!getBidForRequirement(selectedRequirement.id) && (
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => handleBidSubmit(selectedRequirement)}
                    disabled={!bidData.quantity || !bidData.proposedRate}
                  >
                    Submit Bid
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
