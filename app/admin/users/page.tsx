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
import { formatDateTime } from "@/lib/utils"
import { Users, Search, Filter, UserPlus, Edit, Trash2, Eye, Mail, MapPin, Building } from "lucide-react"

// Mock user data for demonstration
const mockUsers = [
  {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    type: "buyer",
    company: "Tech Corp",
    location: "Bangalore",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "user_2", 
    name: "Jane Smith",
    email: "jane@fleetservices.com",
    type: "supplier",
    company: "Fleet Services Ltd",
    location: "Mumbai",
    isActive: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "user_3",
    name: "Mike Wilson",
    email: "mike@rider.com", 
    type: "rider",
    company: "Independent",
    location: "Delhi",
    isActive: false,
    createdAt: new Date("2024-02-01"),
  },
]

export default function AdminUsers() {
  const router = useRouter()
  const { user: currentUser } = useAdminAuth()
  const { dataStore, isInitialized } = useDataStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const loadData = useCallback(async () => {
    if (!isInitialized || !currentUser) return

    try {
      setLoading(true)
      // In a real app, you'd fetch users from an API
      // For now, we'll use mock data
      setUsers(mockUsers)
    } catch (err) {
      console.error("Failed to load users:", err)
    } finally {
      setLoading(false)
    }
  }, [currentUser, isInitialized])

  useEffect(() => {
    if (!currentUser || currentUser.type !== "admin") {
      router.push("/admin/login")
      return
    }
    loadData()
  }, [currentUser, router, loadData])

  useEffect(() => {
    let filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filterType) {
      filtered = filtered.filter(user => user.type === filterType)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, filterType])

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'buyer': return 'bg-status-pending text-status-pending-foreground'
      case 'supplier': return 'bg-status-bidding text-status-bidding-foreground'
      case 'rider': return 'bg-status-matched text-status-matched-foreground'
      case 'admin': return 'bg-primary text-primary-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-status-completed text-status-completed-foreground'
      : 'bg-status-cancelled text-status-cancelled-foreground'
  }

  // CRUD operation handlers
  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setShowAddModal(true)
  }

  const confirmDelete = () => {
    if (selectedUser) {
      try {
        setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    }
    setShowDeleteDialog(false)
    setSelectedUser(null)
  }

  if (!currentUser || currentUser.type !== "admin") {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users and their permissions</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddUser}>
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full h-9 px-3 py-1 border border-input rounded-md text-sm bg-background text-foreground"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All User Types</option>
              <option value="buyer">Buyers</option>
              <option value="supplier">Suppliers</option>
              <option value="rider">Riders</option>
              <option value="admin">Admins</option>
            </select>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filteredUsers.length} of {users.length} users
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Users</CardTitle>
          <CardDescription>All registered users across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No users found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h4 className="font-medium text-foreground">{user.name}</h4>
                      <div className="flex gap-2">
                        <Badge className={getUserTypeColor(user.type)}>
                          {user.type}
                        </Badge>
                        <Badge className={getStatusColor(user.isActive)}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{user.company}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{user.location}</span>
                      </div>
                      <div className="text-xs">
                        Joined {formatDateTime(user.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewUser(user)}
                      className="px-2 sm:px-3"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      className="px-2 sm:px-3"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive px-2 sm:px-3"
                      onClick={() => handleDeleteUser(user)}
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

      {/* View User Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about this user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedUser.name}</div>
                    <div><span className="font-medium">Email:</span> {selectedUser.email}</div>
                    <div><span className="font-medium">User Type:</span>
                      <Badge className={`ml-2 ${getUserTypeColor(selectedUser.type)}`}>
                        {selectedUser.type}
                      </Badge>
                    </div>
                    <div><span className="font-medium">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedUser.isActive)}`}>
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Company & Location</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Company:</span> {selectedUser.company}</div>
                    <div><span className="font-medium">Location:</span> {selectedUser.location}</div>
                    <div><span className="font-medium">Joined:</span> {formatDateTime(selectedUser.createdAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Add user functionality will be implemented here</p>
            <p className="text-sm text-muted-foreground mt-2">This would include a form to create new users</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Edit user functionality will be implemented here</p>
            <p className="text-sm text-muted-foreground mt-2">This would include a form to edit user details</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              "{selectedUser?.name}" and remove all associated data.
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
