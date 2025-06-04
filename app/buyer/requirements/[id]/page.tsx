'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Requirement, Bid } from '@/lib/types'
import { useCompanyAuth } from '@/hooks/useCompanyAuth'
import { useDataStore } from '@/hooks/useDataStore'
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function RequirementDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user: currentUser } = useCompanyAuth()
  const { dataStore, isInitialized } = useDataStore()
  const [requirement, setRequirement] = useState<Requirement | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser || !isInitialized || !params.id) return

    const requirements = dataStore.getRequirements()
    const allBids = dataStore.getBids()
    
    const foundRequirement = requirements.find((req: Requirement) => 
      req.id === params.id && req.buyerId === currentUser.id
    )
    
    if (foundRequirement) {
      setRequirement(foundRequirement)
      const requirementBids = allBids.filter((bid: Bid) => bid.requirementId === foundRequirement.id)
      setBids(requirementBids.sort((a: Bid, b: Bid) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }
    
    setLoading(false)
  }, [currentUser, isInitialized, dataStore, params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-status-pending text-status-pending-foreground border-status-pending'
      case 'bidding': return 'bg-status-active text-status-active-foreground border-status-active'
      case 'matched': return 'bg-secondary text-secondary-foreground border-secondary'
      case 'confirmed': return 'bg-status-success text-status-success-foreground border-status-success'
      case 'completed': return 'bg-muted text-muted-foreground border-border'
      case 'cancelled': return 'bg-status-error text-status-error-foreground border-status-error'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-status-active text-status-active-foreground border-status-active'
      case 'accepted': return 'bg-status-success text-status-success-foreground border-status-success'
      case 'rejected': return 'bg-status-error text-status-error-foreground border-status-error'
      case 'expired': return 'bg-muted text-muted-foreground border-border'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading requirement details...</p>
        </div>
      </div>
    )
  }

  if (!requirement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Requirement not found</h3>
              <p className="text-muted-foreground">The requirement you're looking for doesn't exist or you don't have access to it.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{requirement.title}</h1>
          <p className="text-muted-foreground">Requirement details and bids</p>
        </div>
      </div>

      {/* Requirement Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{requirement.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(requirement.status)}`}>
                  {requirement.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  Posted {formatDateTime(requirement.createdAt)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(requirement.ratePerHour)}/hr
              </div>
              <div className="text-sm text-muted-foreground">Rate per hour</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {requirement.description && (
            <div className="mb-6">
              <h4 className="font-medium text-foreground mb-2">Description</h4>
              <p className="text-muted-foreground">{requirement.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">{requirement.location}</div>
                <div className="text-sm text-muted-foreground">Location</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">{requirement.quantity} riders</div>
                <div className="text-sm text-muted-foreground">Required</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">
                  {formatDateTime(requirement.startDate)} - {formatDateTime(requirement.endDate)}
                </div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">
                  {requirement.startTime} - {requirement.endTime}
                </div>
                <div className="text-sm text-muted-foreground">Daily hours</div>
              </div>
            </div>
          </div>

          {requirement.language && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Language requirement:</span>
                <span className="font-medium text-foreground">{requirement.language}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bids Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Bids ({bids.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bids.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No bids yet</h3>
              <p className="text-muted-foreground">Suppliers haven't submitted any bids for this requirement yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bids.map((bid) => (
                <div key={bid.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-foreground">{bid.supplierName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBidStatusColor(bid.status)}`}>
                          {bid.status}
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
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
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
                      <div className="font-medium text-secondary">{formatCurrency(bid.proposedRate)}</div>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
