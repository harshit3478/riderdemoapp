'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { useApp } from '@/lib/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Bid, Requirement } from '@/lib/types'
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
  // const { state, dispatch } = useApp()
  const router = useRouter()
  const [groupedBids, setGroupedBids] = useState<{ [key: string]: { requirement: Requirement; bids: Bid[] } }>({})

  useEffect(() => {
    // Group bids by requirement for current buyer
    const buyerRequirements = state.requirements.filter(req => req.buyerId === state.currentUser?.id)
    const grouped: { [key: string]: { requirement: Requirement; bids: Bid[] } } = {}

    buyerRequirements.forEach(requirement => {
      const requirementBids = state.bids.filter(bid => bid.requirementId === requirement.id)
      if (requirementBids.length > 0) {
        grouped[requirement.id] = {
          requirement,
          bids: requirementBids.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
      }
    })

    setGroupedBids(grouped)
  }, [state.requirements, state.bids, state.currentUser?.id])

  const handleAcceptBid = (bid: Bid) => {
    // Update bid status
    dispatch({
      type: 'UPDATE_BID',
      payload: {
        id: bid.id,
        updates: { status: 'accepted', updatedAt: new Date() }
      }
    })

    // Update requirement status
    dispatch({
      type: 'UPDATE_REQUIREMENT',
      payload: {
        id: bid.requirementId,
        updates: { status: 'confirmed', updatedAt: new Date() }
      }
    })

    // Reject other bids for the same requirement
    const otherBids = state.bids.filter(b => 
      b.requirementId === bid.requirementId && 
      b.id !== bid.id && 
      b.status === 'submitted'
    )
    
    otherBids.forEach(otherBid => {
      dispatch({
        type: 'UPDATE_BID',
        payload: {
          id: otherBid.id,
          updates: { status: 'rejected', updatedAt: new Date() }
        }
      })
    })

    alert('Bid accepted successfully! The supplier has been notified.')
  }

  const handleRejectBid = (bid: Bid) => {
    dispatch({
      type: 'UPDATE_BID',
      payload: {
        id: bid.id,
        updates: { status: 'rejected', updatedAt: new Date() }
      }
    })

    alert('Bid rejected.')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
        <h1 className="text-2xl font-bold">Proposals & Bids</h1>
        <p className="text-gray-600">Review and manage bids from suppliers for your requirements</p>
      </div>

      {/* Proposals List */}
      {Object.keys(groupedBids).length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No proposals yet
              </h3>
              <p className="text-gray-500 mb-6">
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
                    <div className="text-sm text-gray-500">
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
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold">{bid.supplierName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bid.status)}`}>
                              {getStatusIcon(bid.status)} {bid.status}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
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
                          <span className="text-xs text-gray-500">Fulfillment</span>
                          <div className="font-medium capitalize">{bid.fulfillmentType}</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Riders</span>
                          <div className="font-medium">{bid.quantity}</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Rate/Hour</span>
                          <div className="font-medium text-green-600">
                            {formatCurrency(bid.proposedRate)}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Total Cost</span>
                          <div className="font-semibold text-blue-600">
                            {formatCurrency(calculateTotalCost(bid, requirement))}
                          </div>
                        </div>
                      </div>

                      {bid.message && (
                        <div className="bg-gray-50 rounded p-3">
                          <div className="flex items-start">
                            <MessageSquare className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Message from supplier:</div>
                              <div className="text-sm">{bid.message}</div>
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
                <div className="text-2xl font-bold text-blue-600">
                  {Object.keys(groupedBids).length}
                </div>
                <div className="text-sm text-gray-500">Requirements with Bids</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(groupedBids).reduce((sum, { bids }) => 
                    sum + bids.length, 0
                  )}
                </div>
                <div className="text-sm text-gray-500">Total Proposals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Object.values(groupedBids).reduce((sum, { bids }) => 
                    sum + bids.filter(b => b.status === 'submitted').length, 0
                  )}
                </div>
                <div className="text-sm text-gray-500">Pending Review</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Object.values(groupedBids).reduce((sum, { bids }) => 
                    sum + bids.filter(b => b.status === 'accepted').length, 0
                  )}
                </div>
                <div className="text-sm text-gray-500">Accepted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
