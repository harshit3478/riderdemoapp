"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useRiderAuth } from "@/hooks/useRiderAuth"
import { useDataStore } from "@/hooks/useDataStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/breadcrumb"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { RiderApplication, Requirement } from "@/lib/types"
import {
  Search,
  Filter,
  FileText,
  MapPin,
  Calendar,
  Clock,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  IndianRupeeIcon
} from "lucide-react"

// Extended type for display purposes
interface ApplicationWithRequirement extends RiderApplication {
  requirement?: Requirement
}

export default function RiderApplications() {
  const router = useRouter()
  const { user: currentUser } = useRiderAuth()
  const { dataStore, isInitialized } = useDataStore()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<ApplicationWithRequirement[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [filteredApplications, setFilteredApplications] = useState<ApplicationWithRequirement[]>([])

  const loadData = useCallback(async () => {
    if (!isInitialized || !currentUser) return

    try {
      setLoading(true)
      const allApplications = dataStore.getRiderApplications()
      const allRequirements = dataStore.getRequirements()

      // Filter user applications and join with requirement data
      const userApplications = allApplications
        .filter(app => app.riderId === currentUser.id)
        .map(app => ({
          ...app,
          requirement: allRequirements.find(req => req.id === app.requirementId)
        }))

      setApplications(userApplications)
    } catch (err) {
      console.error("Failed to load applications:", err)
    } finally {
      setLoading(false)
    }
  }, [currentUser, isInitialized, dataStore])

  useEffect(() => {
    if (!currentUser || currentUser.type !== "rider") {
      router.push("/rider/login")
      return
    }
    loadData()
  }, [currentUser, router, loadData])

  useEffect(() => {
    let filtered = applications.filter(app => {
      const requirementTitle = app.requirement?.title || 'Unknown Job'
      const location = app.location || ''

      return (
        requirementTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Sort by application date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredApplications(filtered)
  }, [applications, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-status-pending text-status-pending-foreground'
      case 'confirmed': return 'bg-status-completed text-status-completed-foreground'
      case 'rejected': return 'bg-status-cancelled text-status-cancelled-foreground'
      case 'completed': return 'bg-secondary text-secondary-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <AlertCircle className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getStats = () => {
    return {
      total: applications.length,
      applied: applications.filter(app => app.status === 'applied').length,
      confirmed: applications.filter(app => app.status === 'confirmed').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    }
  }

  const stats = getStats()

  if (!currentUser || currentUser.type !== "rider") {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <PageHeader
          title="My Applications"
          description="Track your job applications and their status"
          breadcrumbs={[
            { label: 'Dashboard', href: '/rider/dashboard' },
            { label: 'My Applications', current: true }
          ]} />

      </div>
      {/* <div>
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="text-muted-foreground">Track your job applications and their status</p>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{stats.applied}</div>
            <p className="text-xs text-muted-foreground">Applied</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full h-9 px-3 py-1 border border-input rounded-md text-sm bg-background text-foreground"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filteredApplications.length} of {applications.length} applications
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
          <CardDescription>All your job applications and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No applications found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || statusFilter
                  ? 'Try adjusting your search or filters.'
                  : 'Start applying for delivery jobs to see them here.'
                }
              </p>
              {!searchTerm && !statusFilter && (
                <div className="mt-6">
                  <Button onClick={() => router.push('/rider/gigs')}>
                    Browse Available Jobs
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors space-y-3 sm:space-y-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                      <h4 className="font-medium text-foreground text-base sm:text-lg">
                        {application.requirement?.title || 'Unknown Job'}
                      </h4>
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status}</span>
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        <span>{application.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        <span>{application.requirement ? formatDateTime(application.requirement.startDate) : 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        <span>{application.timeSlot || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <IndianRupeeIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        <span className="font-medium text-primary">
                          {application.requirement ? formatCurrency(application.requirement.ratePerHour) : 'N/A'}/hr
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        <span>
                          {application.requirement ? `${application.requirement.quantity} riders needed` : 'Details unavailable'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-3 sm:mt-4">
                      Applied {formatDateTime(application.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
