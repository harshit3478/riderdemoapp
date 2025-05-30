import type { Requirement, Bid, RiderApplication } from "./types"
import { mockRequirements, mockBids, mockRiderApplications } from "./data/mockData"

const REQUIREMENTS_KEY = "fleetconnect_requirements"
const BIDS_KEY = "fleetconnect_bids"
const RIDER_APPLICATIONS_KEY = "fleetconnect_rider_applications"

// Simple encoding/decoding for demo security
const encode = (data: string): string => btoa(encodeURIComponent(data))
const decode = (data: string): string => decodeURIComponent(atob(data))

class DataStore {
  private requirements: Requirement[] = []
  private bids: Bid[] = []
  private riderApplications: RiderApplication[] = []
  private isClient = typeof window !== 'undefined'

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    // Only load from localStorage if we're on the client side
    if (!this.isClient) {
      this.initializeWithMockData()
      return
    }

    try {
      // Load requirements
      const storedReqs = localStorage.getItem(REQUIREMENTS_KEY)
      if (storedReqs) {
        const decoded = decode(storedReqs)
        this.requirements = JSON.parse(decoded, this.dateReviver)
      } else {
        this.requirements = mockRequirements.map((req) => ({
          ...req,
          createdAt: new Date(req.createdAt),
          updatedAt: new Date(req.updatedAt),
          startDate: new Date(req.startDate),
          endDate: new Date(req.endDate),
        }))
        this.saveRequirements()
      }

      // Load bids
      const storedBids = localStorage.getItem(BIDS_KEY)
      if (storedBids) {
        const decoded = decode(storedBids)
        this.bids = JSON.parse(decoded, this.dateReviver)
      } else {
        this.bids = mockBids.map((bid) => ({
          ...bid,
          createdAt: new Date(bid.createdAt),
          updatedAt: new Date(bid.updatedAt),
        }))
        this.saveBids()
      }

      // Load rider applications
      const storedApps = localStorage.getItem(RIDER_APPLICATIONS_KEY)
      if (storedApps) {
        const decoded = decode(storedApps)
        this.riderApplications = JSON.parse(decoded, this.dateReviver)
      } else {
        this.riderApplications = mockRiderApplications.map((app) => ({
          ...app,
          createdAt: new Date(app.createdAt),
          updatedAt: new Date(app.updatedAt),
        }))
        this.saveRiderApplications()
      }
    } catch (error) {
      console.error("Failed to load data from storage:", error)
      this.initializeWithMockData()
    }
  }

  private dateReviver(key: string, value: any): any {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return new Date(value)
    }
    return value
  }

  private initializeWithMockData(): void {
    this.requirements = mockRequirements.map((req) => ({
      ...req,
      createdAt: new Date(req.createdAt),
      updatedAt: new Date(req.updatedAt),
      startDate: new Date(req.startDate),
      endDate: new Date(req.endDate),
    }))
    this.bids = mockBids.map((bid) => ({
      ...bid,
      createdAt: new Date(bid.createdAt),
      updatedAt: new Date(bid.updatedAt),
    }))
    this.riderApplications = mockRiderApplications.map((app) => ({
      ...app,
      createdAt: new Date(app.createdAt),
      updatedAt: new Date(app.updatedAt),
    }))
    this.saveAll()
  }

  private saveRequirements(): void {
    if (!this.isClient) return
    
    try {
      const encoded = encode(JSON.stringify(this.requirements))
      localStorage.setItem(REQUIREMENTS_KEY, encoded)
    } catch (error) {
      console.error("Failed to save requirements:", error)
    }
  }

  private saveBids(): void {
    if (!this.isClient) return
    
    try {
      const encoded = encode(JSON.stringify(this.bids))
      localStorage.setItem(BIDS_KEY, encoded)
    } catch (error) {
      console.error("Failed to save bids:", error)
    }
  }

  private saveRiderApplications(): void {
    if (!this.isClient) return
    
    try {
      const encoded = encode(JSON.stringify(this.riderApplications))
      localStorage.setItem(RIDER_APPLICATIONS_KEY, encoded)
    } catch (error) {
      console.error("Failed to save rider applications:", error)
    }
  }

  private saveAll(): void {
    this.saveRequirements()
    this.saveBids()
    this.saveRiderApplications()
  }

  // Method to initialize client-side data after hydration
  initializeClientData(): void {
    if (this.isClient && this.requirements.length === 0) {
      this.loadFromStorage()
    }
  }

  // Requirements methods
  getRequirements(): Requirement[] {
    return [...this.requirements]
  }

  addRequirement(requirement: Requirement): void {
    this.requirements.push(requirement)
    this.saveRequirements()
  }

  updateRequirement(id: string, updates: Partial<Requirement>): void {
    const index = this.requirements.findIndex((req) => req.id === id)
    if (index !== -1) {
      this.requirements[index] = { ...this.requirements[index], ...updates, updatedAt: new Date() }
      this.saveRequirements()
    }
  }

  getRequirementById(id: string): Requirement | undefined {
    return this.requirements.find((req) => req.id === id)
  }

  // Bids methods
  getBids(): Bid[] {
    return [...this.bids]
  }

  addBid(bid: Bid): void {
    this.bids.push(bid)
    this.saveBids()
  }

  updateBid(id: string, updates: Partial<Bid>): void {
    const index = this.bids.findIndex((bid) => bid.id === id)
    if (index !== -1) {
      this.bids[index] = { ...this.bids[index], ...updates, updatedAt: new Date() }
      this.saveBids()
    }
  }

  getBidsByRequirement(requirementId: string): Bid[] {
    return this.bids.filter((bid) => bid.requirementId === requirementId)
  }

  getBidsBySupplier(supplierId: string): Bid[] {
    return this.bids.filter((bid) => bid.supplierId === supplierId)
  }

  // Rider Applications methods
  getRiderApplications(): RiderApplication[] {
    return [...this.riderApplications]
  }

  addRiderApplication(application: RiderApplication): void {
    this.riderApplications.push(application)
    this.saveRiderApplications()
  }

  updateRiderApplication(id: string, updates: Partial<RiderApplication>): void {
    const index = this.riderApplications.findIndex((app) => app.id === id)
    if (index !== -1) {
      this.riderApplications[index] = { ...this.riderApplications[index], ...updates, updatedAt: new Date() }
      this.saveRiderApplications()
    }
  }

  getRiderApplicationsByRider(riderId: string): RiderApplication[] {
    return this.riderApplications.filter((app) => app.riderId === riderId)
  }

  getRiderApplicationsByRequirement(requirementId: string): RiderApplication[] {
    return this.riderApplications.filter((app) => app.requirementId === requirementId)
  }
}

export const dataStore = new DataStore()
