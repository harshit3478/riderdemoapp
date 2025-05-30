'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Bid, Requirement } from '@/lib/types'
import { useRestaurantAuth } from '@/hooks/useRestaurantAuth'
import { useDataStore } from '@/hooks/useDataStore'
import { useToast } from '@/lib/hooks/use-toast'
import {
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  MapPin,
  Calendar
} from 'lucide-react'

export default function ProposalsPage() {
  const router = useRouter()
  const { user: currentUser } = useRestaurantAuth()
  const { dataStore, isInitialized } = useDataStore()
  const { toast } = useToast()
  const [groupedBids, setGroupedBids] = useState<{ [key: string]: { requirement: Requirement; bids: Bid[] } }>({})

  useEffect(() => {
    if (!currentUser || !isInitialized) return

    // Group bids by requirement for current buyer
    const requirements = dataStore.getRequirements()
    const bids = dataStore.getBids()
    const buyerRequirements = requirements.filter((req: Requirement) => req.buyerId === currentUser.id)
    const grouped: { [key: string]: { requirement: Requirement; bids: Bid[] } } = {}

    buyerRequirements.forEach((requirement: Requirement) => {
      const requirementBids = bids.filter((bid: Bid) => bid.requirementId === requirement.id)
      if (requirementBids.length > 0) {
        grouped[requirement.id] = {
          requirement,
          bids: requirementBids.sort((a: Bid, b: Bid) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
      }
    })

    setGroupedBids(grouped)
  }, [currentUser, isInitialized, dataStore])

  const handleAcceptBid = (bid: Bid) => {
    try {
      // Update bid status
      dataStore.updateBid(bid.id, { status: 'accepted', updatedAt: new Date() })

      // Update requirement status
      dataStore.updateRequirement(bid.requirementId, { status: 'confirmed', updatedAt: new Date() })

      // Reject other bids for the same requirement
      const bids = dataStore.getBids()
      const otherBids = bids.filter((b: Bid) =>
        b.requirementId === bid.requirementId &&
        b.id !== bid.id &&
        b.status === 'submitted'
      )

      otherBids.forEach((otherBid: Bid) => {
        dataStore.updateBid(otherBid.id, { status: 'rejected', updatedAt: new Date() })
      })

      toast({
        title: "Success!",
        description: "Bid accepted successfully! The supplier has been notified.",
      })

      // Refresh the data
      const requirements = dataStore.getRequirements()
      const updatedBids = dataStore.getBids()
      const buyerRequirements = requirements.filter((req: Requirement) => req.buyerId === currentUser?.id)
      const grouped: { [key: string]: { requirement: Requirement; bids: Bid[] } } = {}

      buyerRequirements.forEach((requirement: Requirement) => {
        const requirementBids = updatedBids.filter((b: Bid) => b.requirementId === requirement.id)
        if (requirementBids.length > 0) {
          grouped[requirement.id] = {
            requirement,
            bids: requirementBids.sort((a: Bid, b: Bid) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          }
        }
      })
      setGroupedBids(grouped)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept bid. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectBid = (bid: Bid) => {
    try {
      dataStore.updateBid(bid.id, { status: 'rejected', updatedAt: new Date() })

      toast({
        title: "Bid Rejected",
        description: "The bid has been rejected.",
      })

      // Refresh the data
      const requirements = dataStore.getRequirements()
      const updatedBids = dataStore.getBids()
      const buyerRequirements = requirements.filter((req: Requirement) => req.buyerId === currentUser?.id)
      const grouped: { [key: string]: { requirement: Requirement; bids: Bid[] } } = {}

      buyerRequirements.forEach((requirement: Requirement) => {
        const requirementBids = updatedBids.filter((b: Bid) => b.requirementId === requirement.id)
        if (requirementBids.length > 0) {
          grouped[requirement.id] = {
            requirement,
            bids: requirementBids.sort((a: Bid, b: Bid) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          }
        }
      })
      setGroupedBids(grouped)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject bid. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-status-active text-status-active-foreground border-status-active'
      case 'accepted': return 'bg-status-success text-status-success-foreground border-status-success'
      case 'rejected': return 'bg-status-error text-status-error-foreground border-status-error'
      case 'expired': return 'bg-muted text-muted-foreground border-border'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return '📝'
      case 'accepted': return '✅'
      case 'rejected': return '❌'
      case 'expired': return '⏰'
      default: return '📄'
    }
  }

  const calculateTotalCost = (bid: Bid, requirement: Requirement) => {
    const duration = parseInt(requirement.endTime.split(':')[0]) - parseInt(requirement.startTime.split(':')[0])
    const days = Math.ceil((new Date(requirement.endDate).getTime() - new Date(requirement.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    return bid.proposedRate * bid.quantity * duration * days
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Proposals & Bids</h1>
        <p className="text-muted-foreground">Review and manage bids from suppliers for your requirements</p>
      </div>

      {/* Proposals List */}
      {Object.keys(groupedBids).length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No proposals yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Once suppliers start bidding on your requirements, you'll see their proposals here.
              </p>
              <Button onClick={() => router.push('/buyer/post-requirement')}>
                Post a Requirement
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.values(groupedBids).map(({ requirement, bids }) => (
            <Card key={requirement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{requirement.title}</CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center gap-4 text-sm">
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
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatCurrency(requirement.ratePerHour)}/hr
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {bids.length} {bids.length === 1 ? 'proposal' : 'proposals'}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-foreground">{bid.supplierName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bid.status)}`}>
                              {getStatusIcon(bid.status)} {bid.status}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="h-4 w-4 mr-1 text-warning" />
                            <span>4.5 rating</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Submitted {formatDateTime(bid.createdAt)}</span>
                          </div>
                        </div>
                        {bid.status === 'submitted' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectBid(bid)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptBid(bid)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-3">
                        <div>
                          <span className="text-xs text-muted-foreground">Fulfillment</span>
                          <div className="font-medium text-foreground capitalize">{bid.fulfillmentType}</div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Riders</span>
                          <div className="font-medium text-foreground">{bid.quantity}</div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Rate/Hour</span>
                          <div className="font-medium text-secondary">
                            {formatCurrency(bid.proposedRate)}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Total Cost</span>
                          <div className="font-semibold text-primary">
                            {formatCurrency(calculateTotalCost(bid, requirement))}
                          </div>
                        </div>
                      </div>

                      {bid.message && (
                        <div className="bg-muted rounded p-3">
                          <div className="flex items-start">
                            <MessageSquare className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Message from supplier:</div>
                              <div className="text-sm text-foreground">{bid.message}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {Object.keys(groupedBids).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proposals Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {Object.keys(groupedBids).length}
                </div>
                <div className="text-sm text-muted-foreground">Requirements with Bids</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {Object.values(groupedBids).reduce((sum, { bids }) =>
                    sum + bids.length, 0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Proposals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">
                  {Object.values(groupedBids).reduce((sum, { bids }) =>
                    sum + bids.filter(b => b.status === 'submitted').length, 0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  {Object.values(groupedBids).reduce((sum, { bids }) =>
                    sum + bids.filter(b => b.status === 'accepted').length, 0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
