'use client'

import { useState, useEffect } from 'react'
import { useRiderAuth } from '@/hooks/useRiderAuth'
import { useDataStore } from '@/hooks/useDataStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockLocations, languages } from '@/lib/data/mockData'
import { formatCurrency, formatDateTime, generateId } from '@/lib/utils'
import { Requirement, RiderApplication } from '@/lib/types'
import { useToast } from '@/lib/hooks/use-toast'
import {
  Search,
  MapPin,
  Clock,
  Calendar,
  Send,
  Star,
  Users
} from 'lucide-react'

export default function FindGigs() {
  const { user: currentUser } = useRiderAuth()
  const { dataStore, isInitialized } = useDataStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')
  const [filteredGigs, setFilteredGigs] = useState<Requirement[]>([])
  const [selectedGig, setSelectedGig] = useState<Requirement | null>(null)

  useEffect(() => {
    if (!isInitialized || !currentUser) return

    // Get all requirements and rider applications
    const requirements = dataStore.getRequirements()
    const riderApplications = dataStore.getRiderApplications()

    // Filter available gigs (exclude own applications)
    let gigs = requirements.filter(req =>
      ['pending', 'bidding'].includes(req.status) &&
      !riderApplications.some(app =>
        app.requirementId === req.id &&
        app.riderId === currentUser.id
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
  }, [isInitialized, currentUser, searchTerm, locationFilter, languageFilter, dataStore])

  const handleApply = async (gig: Requirement) => {
    if (!currentUser) return

    const newApplication: RiderApplication = {
      id: generateId(),
      riderId: currentUser.id,
      riderName: currentUser.name,
      requirementId: gig.id,
      location: gig.location,
      timeSlot: `${gig.startTime}-${gig.endTime}`,
      language: gig.language,
      status: 'applied',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Add the application using dataStore
    dataStore.addRiderApplication(newApplication)

    // Update requirement status to bidding if it was pending
    if (gig.status === 'pending') {
      dataStore.updateRequirement(gig.id, {
        status: 'bidding',
        updatedAt: new Date()
      })
    }

    setSelectedGig(null)

    // Show success message using toast
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully!",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-status-pending text-status-pending-foreground border-status-pending'
      case 'bidding': return 'bg-status-bidding text-status-bidding-foreground border-status-bidding'
      default: return 'bg-muted text-muted-foreground border-border'
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
        <h1 className="text-2xl font-bold text-foreground">Find Gigs</h1>
        <p className="text-muted-foreground">Discover flexible delivery opportunities near you</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gigs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full h-9 px-3 py-1 border border-input rounded-md text-sm bg-background text-foreground"
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
              className="w-full h-9 px-3 py-1 border border-input rounded-md text-sm bg-background text-foreground"
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
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No gigs found
              </h3>
              <p className="text-muted-foreground">
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
                        <span className="px-2 py-1 bg-secondary/20 text-secondary-foreground rounded text-xs">
                          {gig.language}
                        </span>
                      )}
                    </div>
                    {gig.description && (
                      <p className="text-muted-foreground text-sm mb-3">{gig.description}</p>
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
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{gig.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{gig.startTime} - {gig.endTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formatDateTime(gig.startDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{gig.quantity} riders needed</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-sm text-muted-foreground">Rate:</span>
                      <span className="ml-1 font-semibold text-primary">
                        {formatCurrency(gig.ratePerHour)}/hr
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Potential Earnings:</span>
                      <span className="ml-1 font-semibold text-secondary">
                        {formatCurrency(calculateEarnings(gig))}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span className="ml-1 font-medium text-foreground">
                        {calculateDuration(gig.startTime, gig.endTime)} hours/day
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
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
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="text-sm font-medium text-foreground">{selectedGig.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Time:</span>
                  <span className="text-sm font-medium text-foreground">{selectedGig.startTime} - {selectedGig.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm font-medium text-foreground">{formatDateTime(selectedGig.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rate:</span>
                  <span className="text-sm font-medium text-primary">{formatCurrency(selectedGig.ratePerHour)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Potential Earnings:</span>
                  <span className="text-sm font-semibold text-secondary">{formatCurrency(calculateEarnings(selectedGig))}</span>
                </div>
                {selectedGig.language && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Language:</span>
                    <span className="text-sm font-medium text-foreground">{selectedGig.language}</span>
                  </div>
                )}
              </div>

              <div className="bg-secondary/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-secondary mr-2" />
                  <span className="text-sm text-secondary-foreground font-medium">
                    Your Rating: {currentUser?.reliabilityScore || 4.5}/5.0
                  </span>
                </div>
                <p className="text-xs text-secondary-foreground mt-1">
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
