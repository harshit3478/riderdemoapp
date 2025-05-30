'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockRequirements, mockLocations, languages } from '@/lib/data/mockData'
import { formatCurrency, formatDateTime, generateId } from '@/lib/utils'
import { Requirement, Bid } from '@/lib/types'
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Calendar, 
  Clock,
  DollarSign,
  Send,
  Eye
} from 'lucide-react'

export default function BrowseRequirements() {
  const router = useRouter()
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
    // Use mock requirements directly and filter available ones
    let requirements = mockRequirements.filter(req =>
      ['pending', 'bidding'].includes(req.status)
    )

    // Apply search filter
    if (searchTerm) {
      requirements = requirements.filter(req =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply location filter
    if (locationFilter) {
      requirements = requirements.filter(req => req.location === locationFilter)
    }

    // Sort by creation date (newest first)
    requirements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredRequirements(requirements)
  }, [searchTerm, locationFilter])

  const handleBidSubmit = async (requirement: Requirement) => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser || !bidData.quantity || !bidData.proposedRate) return

    // In a real app, this would be sent to the server
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

    // For demo purposes, just store in localStorage
    const existingBids = JSON.parse(localStorage.getItem('userBids') || '[]')
    existingBids.push(newBid)
    localStorage.setItem('userBids', JSON.stringify(existingBids))

    // Reset form and close modal
    setBidData({
      fulfillmentType: 'partial',
      quantity: '',
      proposedRate: '',
      message: ''
    })
    setSelectedRequirement(null)

    // Show success message (in a real app, you'd use a toast)
    alert('Bid submitted successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'bidding': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">Browse Requirements</h1>
        <p className="text-[hsl(var(--secondary-foreground))]">Find delivery requirements that match your fleet capabilities</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--secondary-foreground))]" />
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
                className="w-full h-9 px-3 py-1 border border-[hsl(var(--border))] rounded-md text-[hsl(var(--foreground))]"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {mockLocations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
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
              <div className="mx-auto w-24 h-24 bg-[hsl(var(--border))] rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-[hsl(var(--secondary-foreground))]" />
              </div>
              <h3 className="text-lg font-medium text-[hsl(var(--primary))] mb-2">
                No requirements found
              </h3>
              <p className="text-[hsl(var(--secondary-foreground))]">
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
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-[hsl(var(--primary))]">{requirement.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(requirement.status)}`}>
                        {requirement.status}
                      </span>
                    </div>
                    {requirement.description && (
                      <p className="text-[hsl(var(--secondary-foreground))] text-sm mb-3">{requirement.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequirement(requirement)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Bid
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-[hsl(var(--secondary-foreground))]">
                    <MapPin className="h-4 w-4 mr-2 text-[hsl(var(--secondary-foreground))]" />
                    <span>{requirement.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-[hsl(var(--secondary-foreground))]">
                    <Users className="h-4 w-4 mr-2 text-[hsl(var(--secondary-foreground))]" />
                    <span>{requirement.quantity} riders needed</span>
                  </div>
                  <div className="flex items-center text-sm text-[hsl(var(--secondary-foreground))]">
                    <Calendar className="h-4 w-4 mr-2 text-[hsl(var(--secondary-foreground))]" />
                    <span>{formatDateTime(requirement.startDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-[hsl(var(--secondary-foreground))]">
                    <Clock className="h-4 w-4 mr-2 text-[hsl(var(--secondary-foreground))]" />
                    <span>{requirement.startTime} - {requirement.endTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[hsl(var(--border))]">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-sm text-[hsl(var(--secondary-foreground))]">Rate:</span>
                      <span className="ml-1 font-semibold text-[hsl(var(--primary))]">
                        {formatCurrency(requirement.ratePerHour)}/hr
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-[hsl(var(--secondary-foreground))]">Total Value:</span>
                      <span className="ml-1 font-semibold text-[hsl(var(--accent))]">
                        {formatCurrency(requirement.ratePerHour * requirement.quantity * 
                          ((new Date(requirement.endDate).getTime() - new Date(requirement.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1) *
                          (parseInt(requirement.endTime.split(':')[0]) - parseInt(requirement.startTime.split(':')[0]))
                        )}
                      </span>
                    </div>
                    {requirement.language && (
                      <div>
                        <span className="text-sm text-[hsl(var(--secondary-foreground))]">Language:</span>
                        <span className="ml-1 font-medium">{requirement.language}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-[hsl(var(--secondary-foreground))]">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Submit Bid</CardTitle>
              <CardDescription>
                Bid for: {selectedRequirement.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Fulfillment Type</label>
                <select
                  className="w-full h-9 px-3 py-1 border border-input rounded-md text-sm mt-1"
                  value={bidData.fulfillmentType}
                  onChange={(e) => setBidData(prev => ({ ...prev, fulfillmentType: e.target.value as 'full' | 'partial' }))}
                >
                  <option value="partial">Partial Fulfillment</option>
                  <option value="full">Full Fulfillment</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
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
                />
              </div>

              <div>
                <label className="text-sm font-medium">Proposed Rate per Hour (INR)</label>
                <Input
                  type="number"
                  min="1"
                  placeholder={`Suggested: ${selectedRequirement.ratePerHour}`}
                  value={bidData.proposedRate}
                  onChange={(e) => setBidData(prev => ({ ...prev, proposedRate: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message (Optional)</label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md text-sm mt-1"
                  placeholder="Add any additional information about your bid..."
                  value={bidData.message}
                  onChange={(e) => setBidData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequirement(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleBidSubmit(selectedRequirement)}
                  disabled={!bidData.quantity || !bidData.proposedRate}
                >
                  Submit Bid
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
