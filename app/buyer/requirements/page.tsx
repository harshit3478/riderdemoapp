'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Requirement, Bid } from '@/lib/types'
import { useRestaurantAuth } from '@/hooks/useRestaurantAuth'
import { useDataStore } from '@/hooks/useDataStore'
import {
  Plus,
  Search,
  MapPin,
  Users,
  Calendar,
  Clock,
  Eye,
} from 'lucide-react'

export default function RequirementsPage() {
  const router = useRouter()
  const { user: currentUser } = useRestaurantAuth()
  const { dataStore, isInitialized } = useDataStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filteredRequirements, setFilteredRequirements] = useState<Requirement[]>([])
  const [allRequirements, setAllRequirements] = useState<Requirement[]>([])

  useEffect(() => {
    if (!currentUser || !isInitialized) return

    // Get requirements for current buyer
    const requirements = dataStore.getRequirements()
    const buyerRequirements = requirements.filter((req: Requirement) => req.buyerId === currentUser.id)
    setAllRequirements(buyerRequirements)
    setFilteredRequirements(buyerRequirements)
  }, [currentUser, isInitialized, dataStore])

  useEffect(() => {
    // Filter requirements based on search and status
    let filtered = allRequirements

    if (searchTerm) {
      filtered = filtered.filter((req: Requirement) =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((req: Requirement) => req.status === statusFilter)
    }

    setFilteredRequirements(filtered)
  }, [searchTerm, statusFilter, allRequirements])

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'bidding': return '📝'
      case 'matched': return '🎯'
      case 'confirmed': return '✅'
      case 'completed': return '🏁'
      case 'cancelled': return '❌'
      default: return '📄'
    }
  }

  const getBidsCount = (requirementId: string) => {
    if (!isInitialized) return 0
    const bids = dataStore.getBids()
    return bids.filter((bid: Bid) => bid.requirementId === requirementId).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Requirements</h1>
          <p className="text-muted-foreground">Manage and track your delivery requirements</p>
        </div>
        <Button onClick={() => router.push('/buyer/post-requirement')}>
          <Plus className="mr-2 h-4 w-4" />
          Post New Requirement
        </Button>
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="bidding">Bidding</option>
                <option value="matched">Matched</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
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
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No requirements found' : 'No requirements yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by posting your first delivery requirement'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => router.push('/buyer/post-requirement')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Post Your First Requirement
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequirements.map((requirement) => (
            <Card key={requirement.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{requirement.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(requirement.status)}`}>
                        {getStatusIcon(requirement.status)} {requirement.status}
                      </span>
                    </div>
                    {requirement.description && (
                      <p className="text-muted-foreground text-sm mb-3">{requirement.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/buyer/requirements/${requirement.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{requirement.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{requirement.quantity} riders</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formatDateTime(requirement.startDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{requirement.startTime} - {requirement.endTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-sm text-muted-foreground">Rate:</span>
                      <span className="ml-1 font-semibold text-primary">
                        {formatCurrency(requirement.ratePerHour)}/hr
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Bids:</span>
                      <span className="ml-1 font-semibold text-secondary">
                        {getBidsCount(requirement.id)}
                      </span>
                    </div>
                    {requirement.language && (
                      <div>
                        <span className="text-sm text-muted-foreground">Language:</span>
                        <span className="ml-1 font-medium">{requirement.language}</span>
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

      {filteredRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {filteredRequirements.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Requirements</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  {filteredRequirements.filter(r => r.status === 'confirmed').length}
                </div>
                <div className="text-sm text-muted-foreground">Confirmed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">
                  {filteredRequirements.filter(r => ['pending', 'bidding', 'matched'].includes(r.status)).length}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {filteredRequirements.reduce((sum, r) => sum + getBidsCount(r.id), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Bids</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
