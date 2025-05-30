'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDriverAuth } from '@/hooks/useDriverAuth'
import { useDataStore } from '@/hooks/useDataStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Bid, Requirement } from '@/lib/types'
import { 
  Search, 
  Filter, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Users,
  MapPin,
  Calendar
} from 'lucide-react'

export default function SupplierBids() {
  const router = useRouter()
  const { user: currentUser } = useDriverAuth()
  const { dataStore, isInitialized } = useDataStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [filteredBids, setFilteredBids] = useState<Bid[]>([])

  useEffect(() => {
    if (!currentUser || !isInitialized) return

    // Get bids from data store for current supplier
    const allBids = dataStore.getBids()
    let bids = allBids.filter((bid: Bid) => bid.supplierId === currentUser.id)

    // Apply search filter
    if (searchTerm) {
      const requirements = dataStore.getRequirements()
      bids = bids.filter((bid: Bid) => {
        const requirement = requirements.find((req: Requirement) => req.id === bid.requirementId)
        return requirement?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               requirement?.location.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    // Apply status filter
    if (statusFilter) {
      bids = bids.filter((bid: Bid) => bid.status === statusFilter)
    }

    // Sort by creation date (newest first)
    bids.sort((a: Bid, b: Bid) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredBids(bids)
  }, [currentUser, isInitialized, dataStore, searchTerm, statusFilter])

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
      case 'submitted': return <Clock className="h-4 w-4" />
      case 'accepted': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'expired': return <AlertCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getBidStats = () => {
    const total = filteredBids.length
    const submitted = filteredBids.filter(bid => bid.status === 'submitted').length
    const accepted = filteredBids.filter(bid => bid.status === 'accepted').length
    const rejected = filteredBids.filter(bid => bid.status === 'rejected').length
    
    return { total, submitted, accepted, rejected }
  }

  const stats = getBidStats()

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Bids</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Track and manage all your submitted bids</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Bids</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-warning" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{stats.submitted}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-success" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{stats.accepted}</p>
                <p className="text-xs text-muted-foreground">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-destructive" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by requirement title or location..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full h-9 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bids List */}
      {filteredBids.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm || statusFilter ? 'No bids found' : 'No bids yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter 
                  ? 'Try adjusting your search or filters.'
                  : 'Start bidding on requirements to see them here.'
                }
              </p>
              {!searchTerm && !statusFilter && (
                <div className="mt-6">
                  <Button onClick={() => router.push('/supplier/browse')}>
                    <Search className="mr-2 h-4 w-4" />
                    Browse Requirements
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBids.map((bid) => {
            const requirements = dataStore.getRequirements()
            const requirement = requirements.find((req: Requirement) => req.id === bid.requirementId)
            
            return (
              <Card key={bid.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {requirement?.title || 'Unknown Requirement'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusColor(bid.status)}`}>
                          {getStatusIcon(bid.status)}
                          {bid.status}
                        </span>
                      </div>
                      
                      {requirement && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {requirement.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {bid.quantity} of {requirement.quantity} riders
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDateTime(requirement.startDate)}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-left sm:text-right sm:ml-4 flex-shrink-0">
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(bid.proposedRate)}/hr
                      </div>
                      <div className="text-sm text-muted-foreground">Your bid</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Fulfillment:</span> {bid.fulfillmentType}
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span> {formatDateTime(bid.createdAt)}
                      </div>
                    </div>

                    {requirement && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => router.push(`/supplier/browse/${requirement.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    )}
                  </div>

                  {bid.message && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Your message:</span>
                        <p className="text-muted-foreground mt-1">{bid.message}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
