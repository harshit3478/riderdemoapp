'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context/AppContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockRequirements, mockLocations, languages } from '@/lib/data/mockData'
import { formatCurrency, formatDateTime, generateId } from '@/lib/utils'
import { Requirement, RiderApplication } from '@/lib/types'
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Calendar,
  DollarSign,
  Send,
  Star,
  Users
} from 'lucide-react'

export default function FindGigs() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')
  const [filteredGigs, setFilteredGigs] = useState<Requirement[]>([])
  const [selectedGig, setSelectedGig] = useState<Requirement | null>(null)

  useEffect(() => {
    // Filter available gigs (exclude own applications)
    let gigs = state.requirements.filter(req => 
      ['pending', 'bidding'].includes(req.status) &&
      !state.riderApplications.some(app => 
        app.requirementId === req.id && 
        app.riderId === state.currentUser?.id
      )
    )

    // Apply search filter
    if (searchTerm) {
      gigs = gigs.filter(req =>
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply location filter
    if (locationFilter) {
      gigs = gigs.filter(req => req.location === locationFilter)
    }

    // Apply language filter
    if (languageFilter) {
      gigs = gigs.filter(req => !req.language || req.language === languageFilter)
    }

    // Sort by creation date (newest first)
    gigs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredGigs(gigs)
  }, [state.requirements, state.riderApplications, state.currentUser?.id, searchTerm, locationFilter, languageFilter])

  const handleApply = async (gig: Requirement) => {
    if (!state.currentUser) return

    const newApplication: RiderApplication = {
      id: generateId(),
      riderId: state.currentUser.id,
      riderName: state.currentUser.name,
      requirementId: gig.id,
      location: gig.location,
      timeSlot: `${gig.startTime}-${gig.endTime}`,
      language: gig.language,
      status: 'applied',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    dispatch({ type: 'ADD_RIDER_APPLICATION', payload: newApplication })
    
    // Update requirement status to bidding if it was pending
    if (gig.status === 'pending') {
      dispatch({ 
        type: 'UPDATE_REQUIREMENT', 
        payload: { 
          id: gig.id, 
          updates: { status: 'bidding', updatedAt: new Date() } 
        } 
      })
    }

    setSelectedGig(null)

    // Show success message (in a real app, you'd use a toast)
    alert('Application submitted successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'bidding': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = parseInt(startTime.split(':')[0])
    const end = parseInt(endTime.split(':')[0])
    return end - start
  }

  const calculateEarnings = (gig: Requirement) => {
    const duration = calculateDuration(gig.startTime, gig.endTime)
    const days = Math.ceil((new Date(gig.endDate).getTime() - new Date(gig.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    return gig.ratePerHour * duration * days
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Find Gigs</h1>
        <p className="text-gray-600">Discover flexible delivery opportunities near you</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search gigs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full h-9 px-3 py-1 border border-input rounded-md text-sm"
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
            <select
              className="w-full h-9 px-3 py-1 border border-input rounded-md text-sm"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
            >
              <option value="">Any Language</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Gigs List */}
      {filteredGigs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No gigs found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters, or check back later for new opportunities.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredGigs.map((gig) => (
            <Card key={gig.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{gig.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(gig.status)}`}>
                        {gig.status}
                      </span>
                      {gig.language && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {gig.language}
                        </span>
                      )}
                    </div>
                    {gig.description && (
                      <p className="text-gray-600 text-sm mb-3">{gig.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedGig(gig)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Apply
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{gig.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{gig.startTime} - {gig.endTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{formatDateTime(gig.startDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{gig.quantity} riders needed</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-sm text-gray-500">Rate:</span>
                      <span className="ml-1 font-semibold text-green-600">
                        {formatCurrency(gig.ratePerHour)}/hr
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Potential Earnings:</span>
                      <span className="ml-1 font-semibold text-blue-600">
                        {formatCurrency(calculateEarnings(gig))}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Duration:</span>
                      <span className="ml-1 font-medium">
                        {calculateDuration(gig.startTime, gig.endTime)} hours/day
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Posted {formatDateTime(gig.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Application Confirmation Modal */}
      {selectedGig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Apply for Gig</CardTitle>
              <CardDescription>
                Confirm your application for: {selectedGig.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium">{selectedGig.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time:</span>
                  <span className="text-sm font-medium">{selectedGig.startTime} - {selectedGig.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium">{formatDateTime(selectedGig.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rate:</span>
                  <span className="text-sm font-medium text-green-600">{formatCurrency(selectedGig.ratePerHour)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Potential Earnings:</span>
                  <span className="text-sm font-semibold text-blue-600">{formatCurrency(calculateEarnings(selectedGig))}</span>
                </div>
                {selectedGig.language && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Language:</span>
                    <span className="text-sm font-medium">{selectedGig.language}</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800 font-medium">
                    Your Rating: {state.currentUser?.reliabilityScore || 4.5}/5.0
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Maintain high ratings to get priority for future gigs!
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedGig(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleApply(selectedGig)}
                >
                  Confirm Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
