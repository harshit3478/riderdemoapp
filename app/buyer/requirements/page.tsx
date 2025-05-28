'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockRequirements, mockBids } from '@/lib/data/mockData'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Requirement } from '@/lib/types'
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Calendar, 
  Clock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

export default function RequirementsPage() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filteredRequirements, setFilteredRequirements] = useState<Requirement[]>([])

  useEffect(() => {
    // Load mock data
    dispatch({ type: 'SET_REQUIREMENTS', payload: mockRequirements })
    dispatch({ type: 'SET_BIDS', payload: mockBids })
  }, [dispatch])

  useEffect(() => {
    // Filter requirements for current buyer
    let requirements = state.requirements.filter(req => req.buyerId === state.currentUser?.id)

    // Apply search filter
    if (searchTerm) {
      requirements = requirements.filter(req =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      requirements = requirements.filter(req => req.status === statusFilter)
    }

    // Sort by creation date (newest first)
    requirements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredRequirements(requirements)
  }, [state.requirements, state.currentUser?.id, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'bidding': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'matched': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
    return state.bids.filter(bid => bid.requirementId === requirementId).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Requirements</h1>
          <p className="text-gray-600">Manage and track your delivery requirements</p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                className="w-full h-9 px-3 py-1 border border-input rounded-md text-sm"
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
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No requirements found' : 'No requirements yet'}
              </h3>
              <p className="text-gray-500 mb-6">
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
                      <p className="text-gray-600 text-sm mb-3">{requirement.description}</p>
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
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{requirement.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{requirement.quantity} riders</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{formatDateTime(requirement.startDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{requirement.startTime} - {requirement.endTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-sm text-gray-500">Rate:</span>
                      <span className="ml-1 font-semibold text-green-600">
                        {formatCurrency(requirement.ratePerHour)}/hr
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Bids:</span>
                      <span className="ml-1 font-semibold text-blue-600">
                        {getBidsCount(requirement.id)}
                      </span>
                    </div>
                    {requirement.language && (
                      <div>
                        <span className="text-sm text-gray-500">Language:</span>
                        <span className="ml-1 font-medium">{requirement.language}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Created {formatDateTime(requirement.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredRequirements.length}
                </div>
                <div className="text-sm text-gray-500">Total Requirements</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {filteredRequirements.filter(r => r.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-500">Confirmed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {filteredRequirements.filter(r => ['pending', 'bidding', 'matched'].includes(r.status)).length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {filteredRequirements.reduce((sum, r) => sum + getBidsCount(r.id), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Bids</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
