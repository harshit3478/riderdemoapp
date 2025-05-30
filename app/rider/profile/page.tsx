"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useRiderAuth } from "@/hooks/useRiderAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Edit, 
  Save, 
  X,
  Camera,
  Award,
  Clock,
  CheckCircle
} from "lucide-react"

interface RiderProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  dateOfBirth?: string
  vehicleType?: string
  licenseNumber?: string
  rating: number
  totalDeliveries: number
  joinedDate: Date
  isVerified: boolean
  skills: string[]
  languages: string[]
  availability: string
}

export default function RiderProfile() {
  const router = useRouter()
  const { user: currentUser } = useRiderAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<RiderProfile | null>(null)
  const [editedProfile, setEditedProfile] = useState<RiderProfile | null>(null)

  useEffect(() => {
    if (!currentUser || currentUser.type !== "rider") {
      router.push("/rider/login")
      return
    }

    // Mock profile data - in a real app, this would come from an API
    const mockProfile: RiderProfile = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email || 'rider@example.com',
      phone: '+91 9876543210',
      location: currentUser.location || 'Bangalore',
      dateOfBirth: '1995-06-15',
      vehicleType: 'Motorcycle',
      licenseNumber: 'KA05AB1234',
      rating: 4.8,
      totalDeliveries: 156,
      joinedDate: new Date('2023-01-15'),
      isVerified: true,
      skills: ['Fast Delivery', 'Customer Service', 'Navigation'],
      languages: ['English', 'Hindi', 'Kannada'],
      availability: 'Full-time'
    }

    setProfile(mockProfile)
    setEditedProfile(mockProfile)
  }, [currentUser, router])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedProfile) {
      setProfile(editedProfile)
      setIsEditing(false)
      // In a real app, you would save to an API here
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const updateField = (field: keyof RiderProfile, value: any) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value })
    }
  }

  if (!currentUser || currentUser.type !== "rider" || !profile) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground text-2xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-1">{profile.name}</h3>
              <p className="text-muted-foreground mb-3">{profile.email}</p>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge className="bg-status-completed text-status-completed-foreground">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
                <Badge variant="outline">
                  {profile.availability}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{profile.rating}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center">
                    <Star className="h-3 w-3 mr-1 text-warning" />
                    Rating
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{profile.totalDeliveries}</div>
                  <div className="text-xs text-muted-foreground">Deliveries</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedProfile?.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2 border border-transparent">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-foreground">{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile?.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2 border border-transparent">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-foreground">{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedProfile?.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2 border border-transparent">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-foreground">{profile.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={editedProfile?.location || ''}
                    onChange={(e) => updateField('location', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2 border border-transparent">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-foreground">{profile.location}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                {isEditing ? (
                  <Input
                    id="dob"
                    type="date"
                    value={editedProfile?.dateOfBirth || ''}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center mt-1 p-2 border border-transparent">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-foreground">{profile.dateOfBirth}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                {isEditing ? (
                  <select
                    id="vehicleType"
                    className="w-full h-9 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm"
                    value={editedProfile?.vehicleType || ''}
                    onChange={(e) => updateField('vehicleType', e.target.value)}
                  >
                    <option value="">Select vehicle type</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Car">Car</option>
                  </select>
                ) : (
                  <div className="flex items-center mt-1 p-2 border border-transparent">
                    <span className="text-foreground">{profile.vehicleType}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4 mr-2" />
                Member since {formatDateTime(profile.joinedDate)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        <Award className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((language, index) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
