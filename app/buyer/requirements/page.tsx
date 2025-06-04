'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Requirement, Bid } from '@/lib/types'
import { useCompanyAuth } from '@/contexts/CompanyAuthContext'
import { PageHeader } from '@/components/ui/breadcrumb'
import { useDataStore } from '@/hooks/useDataStore'
import {
  Plus,
  Search,
  MapPin,
  Users,
  Calendar,
  Clock,
  Eye,
  Filter,
  ChevronDown,
  ArrowLeft
} from 'lucide-react'

export default function RequirementsPage() {
  const router = useRouter()
  const { user: currentUser } = useCompanyAuth()
  const { dataStore, isInitialized } = useDataStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
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
    <div className="max-w-7xl mx-auto p-4 space-y-6">
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
          title="My Requirements"
          description="Manage and track your delivery requirements"
          breadcrumbs={[
            { label: 'Dashboard', href: '/buyer/dashboard' },
            { label: 'My Requirements', current: true }
          ]} />

      </div>

      <Button
        onClick={() => router.push('/buyer/post-requirement')}
        variant="default"
        className="w-full sm:w-auto mr-2"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Post New Requirement</span>
        <span className="sm:hidden">Post New</span>
      </Button>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Button - Mobile */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            {/* Status Filter - Desktop */}
            <div className="hidden sm:block sm:w-48">
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

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border sm:hidden">
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
          )}
        </CardContent>
      </Card>

      {/* Requirements List */}
      {filteredRequirements.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No requirements found' : 'No requirements yet'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters to find what you\'re looking for'
                  : 'Get started by posting your first delivery requirement and connect with riders'
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
            <Card key={requirement.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-foreground leading-tight">
                        {requirement.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(requirement.status)} self-start`}>
                        {getStatusIcon(requirement.status)} {requirement.status}
                      </span>
                    </div>
                    {requirement.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {requirement.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/buyer/requirements/${requirement.id}`)}
                    className="w-full sm:w-auto mr-2 mb-4"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                </div>

                {/* Requirement Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{requirement.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{requirement.quantity} riders needed</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{formatDateTime(requirement.startDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{requirement.startTime} - {requirement.endTime}</span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-4 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
            {/* Summary Cards */}
      {filteredRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className='border p-4 rounded-lg'>
                <div className="text-2xl font-bold text-primary">
                  {filteredRequirements.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Requirements</div>
              </div>
              <div className='border p-4 rounded-lg'>
                <div className="text-2xl font-bold text-success">
                  {filteredRequirements.filter(r => r.status === 'confirmed').length}
                </div>
                <div className="text-sm text-muted-foreground">Confirmed</div>
              </div>
              <div className='border p-4 rounded-lg'>
                <div className="text-2xl font-bold text-warning">
                  {filteredRequirements.filter(r => ['pending', 'bidding', 'matched'].includes(r.status)).length}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className='border p-4 rounded-lg'>
                <div className="text-2xl font-bold text-primary">
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