'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Bid, Requirement } from '@/lib/types'
import { PageHeader } from '@/components/ui/breadcrumb'
import { useCompanyAuth } from '@/contexts/CompanyAuthContext'
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
  Calendar,
  ArrowLeft
} from 'lucide-react'

export default function ProposalsPage() {
  const router = useRouter()
  const { user: currentUser } = useCompanyAuth()
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
      {/* Header */}
      <div className="w-full">
        {/* Button row - above header content */}
        <div className="flex justify-between items-center mb-6 ">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { router.back() }}
            className="w-full sm:w-auto mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
      <div>
        <PageHeader
          title="Proposals"
          description="Review and manage bids from suppliers for your requirements"
          breadcrumbs={[
            { label: 'Dashboard', href: '/buyer/dashboard' },
            { label: 'Proposals', current: true }
          ]} />

      </div>
      {/* <div>
        <h1 className="text-2xl font-bold text-foreground">Proposals & Bids</h1>
        <p className="text-muted-foreground">Review and manage bids from suppliers for your requirements</p>
      </div> */}

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
              <p className="text-muted-foreground mb-6 px-4">
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
              <CardHeader className="pb-3">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight">{requirement.title}</CardTitle>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-medium text-foreground">
                        {bids.length} {bids.length === 1 ? 'proposal' : 'proposals'}
                      </div>
                    </div>
                  </div>

                  {/* Mobile-optimized requirement details */}
                  <div className="space-y-2 sm:space-y-0">
                    {/* First row on mobile */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 shrink-0" />
                        <span className="truncate">{requirement.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 shrink-0" />
                        <span>{requirement.quantity} riders</span>
                      </div>
                    </div>

                    {/* Second row on mobile */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 shrink-0" />
                        <span className="truncate">{formatDateTime(requirement.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 shrink-0" />
                        <span className="font-medium text-primary">{formatCurrency(requirement.ratePerHour)}/hr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="border border-border rounded-lg p-3 sm:p-4 hover:bg-muted transition-colors"
                    >
                      {/* Supplier header */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">{bid.supplierName}</h4>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-warning shrink-0" />
                                <span>4.5</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center truncate">
                                <Clock className="h-4 w-4 mr-1 shrink-0" />
                                <span className="truncate">{formatDateTime(bid.createdAt)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status badge */}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border shrink-0 ${getStatusColor(bid.status)}`}>
                            {getStatusIcon(bid.status)} {bid.status}
                          </span>
                        </div>
                      </div>

                      {/* Bid details - optimized for mobile */}
                      <div className="space-y-3 mb-3">
                        {/* Mobile: Stack in pairs */}
                        <div className="grid grid-cols-2 gap-3 sm:hidden">
                          <div className="bg-accent/30 p-2 rounded border">
                            <div className="text-xs text-muted-foreground">Fulfillment</div>
                            <div className="font-medium text-foreground capitalize text-sm">{bid.fulfillmentType}</div>
                          </div>
                          <div className="bg-accent/30 p-2 rounded border">
                            <div className="text-xs text-muted-foreground">Riders</div>
                            <div className="font-medium text-foreground text-sm">{bid.quantity}</div>
                          </div>
                          <div className="bg-accent/30 p-2 rounded border">
                            <div className="text-xs text-muted-foreground">Rate/Hour</div>
                            <div className="font-medium text-secondary text-sm">
                              {formatCurrency(bid.proposedRate)}
                            </div>
                          </div>
                          <div className="bg-accent/30 p-2 rounded border">
                            <div className="text-xs text-muted-foreground">Total Cost</div>
                            <div className="font-semibold text-primary text-sm">
                              {formatCurrency(calculateTotalCost(bid, requirement))}
                            </div>
                          </div>
                        </div>

                        {/* Desktop: Original 4-column layout */}
                        <div className="hidden sm:grid sm:grid-cols-4 gap-4">
                          <div className='border rounded-lg p-2'>
                            <span className="text-xs text-muted-foreground">Fulfillment</span>
                            <div className="font-medium text-foreground capitalize">{bid.fulfillmentType}</div>
                          </div>
                          <div className='border rounded-lg p-2'>
                            <span className="text-xs text-muted-foreground">Riders</span>
                            <div className="font-medium text-foreground">{bid.quantity}</div>
                          </div>
                          <div className='border rounded-lg p-2'>
                            <span className="text-xs text-muted-foreground">Rate/Hour</span>
                            <div className="font-medium text-secondary">
                              {formatCurrency(bid.proposedRate)}
                            </div>
                          </div>
                          <div className='border rounded-lg p-2'>
                            <span className="text-xs text-muted-foreground">Total Cost</span>
                            <div className="font-semibold text-primary">
                              {formatCurrency(calculateTotalCost(bid, requirement))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message section */}
                      {bid.message && (
                        <div className="bg-muted rounded p-3 mb-5">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-muted-foreground mb-1">Message from supplier:</div>
                              <div className="text-sm text-foreground break-words">{bid.message}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mobile action buttons */}
                      {bid.status === 'submitted' && (
                        <div className="flex gap-2 sm:hidden">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectBid(bid)}
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptBid(bid)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      )}

                      {/* Desktop action buttons */}
                      {bid.status === 'submitted' && (
                        <div className="hidden sm:flex gap-2 justify-end">
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => handleRejectBid(bid)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="lg"
                            onClick={() => handleAcceptBid(bid)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
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
              <div className="border p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {Object.keys(groupedBids).length}
                </div>
                <div className="text-sm text-muted-foreground">Requirements with Bids</div>
              </div>
              <div className="border p-4 rounded-lg">
                <div className="text-2xl font-bold text-secondary">
                  {Object.values(groupedBids).reduce((sum, { bids }) =>
                    sum + bids.length, 0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Proposals</div>
              </div>
              <div className="border p-4 rounded-lg">
                <div className="text-2xl font-bold text-warning">
                  {Object.values(groupedBids).reduce((sum, { bids }) =>
                    sum + bids.filter(b => b.status === 'submitted').length, 0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
              <div className="border p-4 rounded-lg">
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
