"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useDataStore } from "@/hooks/useDataStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/lib/hooks/use-toast"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { Requirement } from "@/lib/types"
import { FileText, Search, Filter, Eye, Edit, Trash2, MapPin, Clock, Users, Plus } from "lucide-react"

export default function AdminRequirements() {
  const router = useRouter()
  const { user: currentUser } = useAdminAuth()
  const { dataStore, isInitialized } = useDataStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [filteredRequirements, setFilteredRequirements] = useState<Requirement[]>([])

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null)

  const loadData = useCallback(async () => {
    if (!isInitialized || !currentUser) return

    try {
      setLoading(true)
      const reqs = dataStore.getRequirements()
      setRequirements(reqs)
    } catch (err) {
      console.error("Failed to load requirements:", err)
    } finally {
      setLoading(false)
    }
  }, [currentUser, isInitialized, dataStore])

  useEffect(() => {
    if (!currentUser || currentUser.type !== "admin") {
      router.push("/admin/login")
      return
    }
    loadData()
  }, [currentUser, router, loadData])

  useEffect(() => {
    let filtered = requirements.filter(req => 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (statusFilter) {
      filtered = filtered.filter(req => req.status === statusFilter)
    }

    setFilteredRequirements(filtered)
  }, [requirements, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-status-pending text-status-pending-foreground'
      case 'bidding': return 'bg-status-bidding text-status-bidding-foreground'
      case 'matched': return 'bg-status-matched text-status-matched-foreground'
      case 'completed': return 'bg-status-completed text-status-completed-foreground'
      case 'cancelled': return 'bg-status-cancelled text-status-cancelled-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStats = () => {
    return {
      total: requirements.length,
      pending: requirements.filter(r => r.status === 'pending').length,
      active: requirements.filter(r => ['pending', 'bidding', 'matched'].includes(r.status)).length,
      completed: requirements.filter(r => r.status === 'completed').length,
    }
  }

  // CRUD operation handlers
  const handleViewRequirement = (requirement: Requirement) => {
    setSelectedRequirement(requirement)
    setShowViewModal(true)
  }

  const handleEditRequirement = (requirement: Requirement) => {
    setSelectedRequirement(requirement)
    setShowEditModal(true)
  }

  const handleDeleteRequirement = (requirement: Requirement) => {
    setSelectedRequirement(requirement)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (selectedRequirement) {
      try {
        dataStore.deleteRequirement(selectedRequirement.id)
        setRequirements(prev => prev.filter(r => r.id !== selectedRequirement.id))
        toast({
          title: "Success",
          description: "Requirement deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete requirement",
          variant: "destructive",
        })
      }
    }
    setShowDeleteDialog(false)
    setSelectedRequirement(null)
  }

  const stats = getStats()

  if (!currentUser || currentUser.type !== "admin") {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Requirements Management</h1>
        <p className="text-muted-foreground">Monitor and manage all delivery requirements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Requirements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-accent">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
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
                placeholder="Search requirements..."
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
              <option value="pending">Pending</option>
              <option value="bidding">Bidding</option>
              <option value="matched">Matched</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filteredRequirements.length} of {requirements.length} requirements
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements List */}
      <Card>
        <CardHeader>
          <CardTitle>All Requirements</CardTitle>
          <CardDescription>Complete list of delivery requirements</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading requirements...</p>
            </div>
          ) : filteredRequirements.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No requirements found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequirements.map((requirement) => (
                <div
                  key={requirement.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h4 className="font-medium text-foreground">{requirement.title}</h4>
                      <Badge className={getStatusColor(requirement.status)}>
                        {requirement.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{requirement.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{requirement.startTime} - {requirement.endTime}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>{requirement.quantity} riders</span>
                      </div>
                      <div className="font-medium text-primary">
                        {formatCurrency(requirement.ratePerHour)}/hr
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 sm:mt-1">
                      Created {formatDateTime(requirement.createdAt)} • Updated {formatDateTime(requirement.updatedAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequirement(requirement)}
                      className="px-2 sm:px-3"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRequirement(requirement)}
                      className="px-2 sm:px-3"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive px-2 sm:px-3"
                      onClick={() => handleDeleteRequirement(requirement)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Requirement Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Requirement Details</DialogTitle>
            <DialogDescription>
              View detailed information about this requirement
            </DialogDescription>
          </DialogHeader>
          {selectedRequirement && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Title:</span> {selectedRequirement.title}</div>
                    <div><span className="font-medium">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedRequirement.status)}`}>
                        {selectedRequirement.status}
                      </Badge>
                    </div>
                    <div><span className="font-medium">Location:</span> {selectedRequirement.location}</div>
                    <div><span className="font-medium">Riders Needed:</span> {selectedRequirement.quantity}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Schedule & Payment</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Date:</span> {selectedRequirement.date}</div>
                    <div><span className="font-medium">Time:</span> {selectedRequirement.startTime} - {selectedRequirement.endTime}</div>
                    <div><span className="font-medium">Rate:</span> {formatCurrency(selectedRequirement.ratePerHour)}/hr</div>
                    <div><span className="font-medium">Created:</span> {formatDateTime(selectedRequirement.createdAt)}</div>
                  </div>
                </div>
              </div>
              {selectedRequirement.description && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedRequirement.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Requirement Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Requirement</DialogTitle>
            <DialogDescription>
              Update requirement information
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Edit functionality will be implemented here</p>
            <p className="text-sm text-muted-foreground mt-2">This would include a form to edit requirement details</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the requirement
              "{selectedRequirement?.title}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
