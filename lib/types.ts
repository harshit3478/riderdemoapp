export type UserType = 'restaurant' | 'driver' | 'rider' | 'admin'

// Legacy type mappings for backward compatibility
export type LegacyUserType = 'buyer' | 'supplier' | 'rider' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  type: UserType
  company?: string
  phone?: string
  location?: string
  avatar?: string
  reliabilityScore?: number
  isActive: boolean
  createdAt: Date
}

export interface Requirement {
  id: string
  buyerId: string
  buyerCompany: string
  title: string
  description?: string
  quantity: number
  location: string
  pincode: string
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  ratePerHour: number
  language?: string
  status: 'pending' | 'bidding' | 'matched' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  bids: Bid[]
  matchedPlan?: MatchingPlan
}

export interface Bid {
  id: string
  requirementId: string
  supplierId: string
  supplierName: string
  fulfillmentType: 'full' | 'partial'
  quantity: number
  proposedRate: number
  message?: string
  status: 'submitted' | 'accepted' | 'rejected' | 'expired'
  createdAt: Date
  updatedAt: Date
}

export interface RiderApplication {
  id: string
  riderId: string
  riderName: string
  requirementId: string
  location: string
  timeSlot: string
  language?: string
  status: 'applied' | 'confirmed' | 'rejected' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export interface MatchingPlan {
  id: string
  requirementId: string
  supplierBids: {
    bidId: string
    supplierId: string
    supplierName: string
    quantity: number
    rate: number
  }[]
  riderApplications: {
    applicationId: string
    riderId: string
    riderName: string
    quantity: number
    rate: number
  }[]
  totalMatched: number
  totalRequired: number
  averageRate: number
  status: 'proposed' | 'accepted' | 'rejected'
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: Date
  actionUrl?: string
}

export interface DashboardStats {
  totalRequirements: number
  activeRequirements: number
  completedRequirements: number
  totalBids: number
  acceptedBids: number
  totalRiders: number
  activeRiders: number
  averageRating: number
  totalRevenue: number
  fulfillmentRate: number
}

// Location data
export interface Location {
  id: string
  name: string
  pincode: string
  city: string
  state: string
}

// Filter types
export interface RequirementFilters {
  location?: string
  dateRange?: {
    start: Date
    end: Date
  }
  timeSlot?: string
  language?: string
  rateRange?: {
    min: number
    max: number
  }
  status?: string[]
}

export interface BidFilters {
  status?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  location?: string
}

export interface RiderFilters {
  location?: string
  timeSlot?: string
  language?: string
  availability?: 'available' | 'busy' | 'all'
}
