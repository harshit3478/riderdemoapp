'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDriverAuth } from '@/hooks/useDriverAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatDateTime } from '@/lib/utils'
import { 
  Search, 
  Filter, 
  Users, 
  UserCheck,
  UserX,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Activity,
  Plus,
  Eye,
  Edit
} from 'lucide-react'

interface Rider {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: 'active' | 'inactive' | 'busy'
  rating: number
  totalDeliveries: number
  joinedDate: Date
  vehicleType: string
  licenseNumber: string
  lastActive: Date
}

// Mock data for riders
const mockRiders: Rider[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    location: 'Mumbai Central',
    status: 'active',
    rating: 4.8,
    totalDeliveries: 245,
    joinedDate: new Date('2023-01-15'),
    vehicleType: 'Motorcycle',
    licenseNumber: 'MH12AB1234',
    lastActive: new Date()
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 87654 32109',
    location: 'Andheri West',
    status: 'busy',
    rating: 4.9,
    totalDeliveries: 189,
    joinedDate: new Date('2023-03-20'),
    vehicleType: 'Scooter',
    licenseNumber: 'MH12CD5678',
    lastActive: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91 76543 21098',
    location: 'Bandra East',
    status: 'active',
    rating: 4.6,
    totalDeliveries: 156,
    joinedDate: new Date('2023-05-10'),
    vehicleType: 'Motorcycle',
    licenseNumber: 'MH12EF9012',
    lastActive: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: '+91 65432 10987',
    location: 'Powai',
    status: 'inactive',
    rating: 4.7,
    totalDeliveries: 98,
    joinedDate: new Date('2023-07-25'),
    vehicleType: 'Scooter',
    licenseNumber: 'MH12GH3456',
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 54321 09876',
    location: 'Thane West',
    status: 'active',
    rating: 4.5,
    totalDeliveries: 203,
    joinedDate: new Date('2022-11-08'),
    vehicleType: 'Motorcycle',
    licenseNumber: 'MH12IJ7890',
    lastActive: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
  }
]

export default function SupplierRiders() {
  const router = useRouter()
  const { user: currentUser } = useDriverAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [filteredRiders, setFilteredRiders] = useState<Rider[]>(mockRiders)
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingRider, setEditingRider] = useState<Rider | null>(null)

  useEffect(() => {
    let riders = [...mockRiders]

    // Apply search filter
    if (searchTerm) {
      riders = riders.filter(rider =>
        rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.phone.includes(searchTerm)
      )
    }

    // Apply status filter
    if (statusFilter) {
      riders = riders.filter(rider => rider.status === statusFilter)
    }

    // Sort by last active (most recent first)
    riders.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime())

    setFilteredRiders(riders)
  }, [searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-status-success text-status-success-foreground border-status-success'
      case 'busy': return 'bg-status-active text-status-active-foreground border-status-active'
      case 'inactive': return 'bg-muted text-muted-foreground border-border'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="h-4 w-4" />
      case 'busy': return <Activity className="h-4 w-4" />
      case 'inactive': return <UserX className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const getRiderStats = () => {
    const total = filteredRiders.length
    const active = filteredRiders.filter(rider => rider.status === 'active').length
    const busy = filteredRiders.filter(rider => rider.status === 'busy').length
    const inactive = filteredRiders.filter(rider => rider.status === 'inactive').length
    const avgRating = filteredRiders.reduce((sum, rider) => sum + rider.rating, 0) / total || 0
    
    return { total, active, busy, inactive, avgRating }
  }

  const stats = getRiderStats()

  const handleViewRider = (rider: Rider) => {
    setSelectedRider(rider)
    setShowViewModal(true)
  }

  const handleEditRider = (rider: Rider) => {
    setEditingRider({ ...rider })
    setShowEditModal(true)
  }

  const handleAddRider = () => {
    setEditingRider({
      id: '',
      name: '',
      email: '',
      phone: '',
      location: '',
      status: 'active',
      rating: 0,
      totalDeliveries: 0,
      joinedDate: new Date(),
      vehicleType: '',
      licenseNumber: '',
      lastActive: new Date()
    })
    setShowAddModal(true)
  }

  const handleSaveRider = () => {
    if (editingRider) {
      if (editingRider.id) {
        // Update existing rider
        const updatedRiders = mockRiders.map(rider =>
          rider.id === editingRider.id ? editingRider : rider
        )
        setFilteredRiders(updatedRiders)
      } else {
        // Add new rider
        const newRider = {
          ...editingRider,
          id: Date.now().toString(),
          joinedDate: new Date(),
          lastActive: new Date()
        }
        mockRiders.push(newRider)
        setFilteredRiders([...mockRiders])
      }
    }
    setShowEditModal(false)
    setShowAddModal(false)
    setEditingRider(null)
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Riders</h1>
          <p className="text-muted-foreground">Manage your fleet of delivery riders</p>
        </div>
        <Button onClick={handleAddRider} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Rider
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Riders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-success" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-warning" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{stats.busy}</p>
                <p className="text-xs text-muted-foreground">Busy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-destructive" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{stats.inactive}</p>
                <p className="text-xs text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-warning" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">{stats.avgRating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
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
                  placeholder="Search by name, email, phone, or location..."
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
                <option value="active">Active</option>
                <option value="busy">Busy</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Riders List */}
      {filteredRiders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm || statusFilter ? 'No riders found' : 'No riders yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter 
                  ? 'Try adjusting your search or filters.'
                  : 'Add riders to your fleet to get started.'
                }
              </p>
              {!searchTerm && !statusFilter && (
                <div className="mt-6">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Rider
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRiders.map((rider) => (
            <Card key={rider.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-primary-foreground text-lg font-medium">
                        {rider.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{rider.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(rider.status)}`}>
                          {getStatusIcon(rider.status)}
                          {rider.status}
                        </span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-4 w-4 mr-1 text-warning" />
                          {rider.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewRider(rider)} className="flex-shrink-0">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View rider</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditRider(rider)} className="flex-shrink-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit rider</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-3" />
                    <span>{rider.email}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-3" />
                    <span>{rider.phone}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-3" />
                    <span>{rider.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-3" />
                    <span>Joined {formatDateTime(rider.joinedDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{rider.totalDeliveries}</span>
                    <span className="text-muted-foreground"> deliveries</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{rider.vehicleType}</span>
                    <span className="text-muted-foreground"> • {rider.licenseNumber}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  Last active: {formatDateTime(rider.lastActive)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Rider Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rider Details</DialogTitle>
            <DialogDescription>
              View detailed information about {selectedRider?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedRider && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground text-xl font-medium">
                    {selectedRider.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedRider.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(selectedRider.status)}`}>
                      {getStatusIcon(selectedRider.status)}
                      {selectedRider.status}
                    </span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-1 text-warning" />
                      {selectedRider.rating} rating
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Contact Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-muted-foreground break-all">
                      <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="break-all">{selectedRider.email}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span>{selectedRider.phone}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="break-words">{selectedRider.location}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Performance</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Deliveries:</span>
                      <span className="font-medium text-foreground">{selectedRider.totalDeliveries}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-medium text-foreground">{selectedRider.rating}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Vehicle:</span>
                      <span className="font-medium text-foreground break-words">{selectedRider.vehicleType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">License:</span>
                      <span className="font-medium text-foreground break-all">{selectedRider.licenseNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Activity</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="font-medium text-foreground text-right break-words">{formatDateTime(selectedRider.joinedDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Active:</span>
                    <span className="font-medium text-foreground text-right break-words">{formatDateTime(selectedRider.lastActive)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit/Add Rider Modal */}
      <Dialog open={showEditModal || showAddModal} onOpenChange={(open) => {
        if (!open) {
          setShowEditModal(false)
          setShowAddModal(false)
          setEditingRider(null)
        }
      }}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showAddModal ? 'Add New Rider' : 'Edit Rider'}</DialogTitle>
            <DialogDescription>
              {showAddModal ? 'Add a new rider to your fleet' : 'Update rider information'}
            </DialogDescription>
          </DialogHeader>
          {editingRider && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editingRider.name}
                    onChange={(e) => setEditingRider({ ...editingRider, name: e.target.value })}
                    placeholder="Enter rider's full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingRider.email}
                    onChange={(e) => setEditingRider({ ...editingRider, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editingRider.phone}
                    onChange={(e) => setEditingRider({ ...editingRider, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editingRider.location}
                    onChange={(e) => setEditingRider({ ...editingRider, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <select
                    id="vehicleType"
                    className="w-full h-9 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm"
                    value={editingRider.vehicleType}
                    onChange={(e) => setEditingRider({ ...editingRider, vehicleType: e.target.value })}
                  >
                    <option value="">Select vehicle type</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Car">Car</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={editingRider.licenseNumber}
                    onChange={(e) => setEditingRider({ ...editingRider, licenseNumber: e.target.value })}
                    placeholder="Enter license number"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="w-full h-9 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm"
                    value={editingRider.status}
                    onChange={(e) => setEditingRider({ ...editingRider, status: e.target.value as 'active' | 'inactive' | 'busy' })}
                  >
                    <option value="active">Active</option>
                    <option value="busy">Busy</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                {!showAddModal && (
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={editingRider.rating}
                      onChange={(e) => setEditingRider({ ...editingRider, rating: parseFloat(e.target.value) || 0 })}
                      placeholder="Enter rating (0-5)"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setShowEditModal(false)
                    setShowAddModal(false)
                    setEditingRider(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleSaveRider}
                >
                  {showAddModal ? 'Add Rider' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
