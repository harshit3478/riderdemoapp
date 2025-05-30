import type { User, UserType } from "./types"

// Secure storage using localStorage with encryption-like encoding
const STORAGE_KEY = "fleetconnect_auth"
const USERS_KEY = "fleetconnect_users"

// Simple encoding/decoding for demo security
const encode = (data: string): string => btoa(encodeURIComponent(data))
const decode = (data: string): string => decodeURIComponent(atob(data))

interface StoredAuth {
  currentUser: User | null
  isAuthenticated: boolean
}

interface StoredUsers {
  [email: string]: {
    password: string
    userData: User
  }
}

class AuthService {
  private currentUser: User | null = null
  private isAuthenticated = false

  constructor() {
    this.loadFromStorage()
    this.initializeDefaultUsers()
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const decoded = decode(stored)
        const authData: StoredAuth = JSON.parse(decoded)
        this.currentUser = authData.currentUser
        this.isAuthenticated = authData.isAuthenticated
      }
    } catch (error) {
      console.error("Failed to load auth from storage:", error)
      this.clearStorage()
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    try {
      const authData: StoredAuth = {
        currentUser: this.currentUser,
        isAuthenticated: this.isAuthenticated,
      }
      const encoded = encode(JSON.stringify(authData))
      localStorage.setItem(STORAGE_KEY, encoded)
    } catch (error) {
      console.error("Failed to save auth to storage:", error)
    }
  }

  private initializeDefaultUsers(): void {
    const existingUsers = this.getStoredUsers()

    // Initialize default demo users if they don't exist
    const defaultUsers = [
      {
        email: "buyer@example.com",
        password: "password123",
        userData: {
          id: "buyer_demo",
          name: "Demo Buyer",
          email: "buyer@example.com",
          company: "Demo Company",
          location: "Bangalore",
          type: "buyer" as UserType,
          isActive: true,
          createdAt: new Date(),
        },
      },
      {
        email: "supplier@example.com",
        password: "password123",
        userData: {
          id: "supplier_demo",
          name: "Demo Supplier",
          email: "supplier@example.com",
          company: "Demo Fleet Services",
          location: "Bangalore",
          reliabilityScore: 4.5,
          type: "supplier" as UserType,
          isActive: true,
          createdAt: new Date(),
        },
      },
      {
        email: "rider@example.com",
        password: "password123",
        userData: {
          id: "rider_demo",
          name: "Demo Rider",
          email: "rider@example.com",
          location: "Koramangala, Bangalore",
          reliabilityScore: 4.7,
          type: "rider" as UserType,
          isActive: true,
          createdAt: new Date(),
        },
      },
      {
        email: "admin@fleetconnect.com",
        password: "admin123",
        userData: {
          id: "admin_demo",
          name: "Demo Admin",
          email: "admin@fleetconnect.com",
          company: "FleetConnect",
          location: "Bangalore",
          type: "admin" as UserType,
          isActive: true,
          createdAt: new Date(),
        },
      },
    ]

    let hasChanges = false
    defaultUsers.forEach((user) => {
      if (!existingUsers[user.email]) {
        existingUsers[user.email] = {
          password: user.password,
          userData: user.userData,
        }
        hasChanges = true
      }
    })

    if (hasChanges) {
      this.saveStoredUsers(existingUsers)
    }
  }

  private getStoredUsers(): StoredUsers {
    if (typeof window === 'undefined') return {}; // Skip during SSR
    
    try {
      const stored = localStorage.getItem(USERS_KEY)
      if (stored) {
        const decoded = decode(stored)
        return JSON.parse(decoded)
      }
    } catch (error) {
      console.error("Failed to load users from storage:", error)
    }
    return {}
  }

  private saveStoredUsers(users: StoredUsers): void {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    try {
      const encoded = encode(JSON.stringify(users))
      localStorage.setItem(USERS_KEY, encoded)
    } catch (error) {
      console.error("Failed to save users to storage:", error)
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // For demo purposes, accept any email/password combination
    // Just ensure we have a default user for the demo
    
    // Extract user type from email pattern or default to buyer
    let userType: UserType = "buyer"
    if (email.includes("supplier")) userType = "supplier"
    else if (email.includes("rider")) userType = "rider"  
    else if (email.includes("admin")) userType = "admin"
    else if (email.includes("buyer")) userType = "buyer"

    // Check if we have a stored user, otherwise create a demo user
    const users = this.getStoredUsers()
    let userRecord = users[email.toLowerCase()]

    if (!userRecord) {
      // Create a demo user on the fly
      const demoUser: User = {
        id: `${userType}_${Date.now()}`,
        name: `Demo ${userType.charAt(0).toUpperCase() + userType.slice(1)}`,
        email: email,
        company: userType === "admin" ? "FleetConnect" : `Demo ${userType.charAt(0).toUpperCase() + userType.slice(1)} Company`,
        location: "Bangalore",
        type: userType,
        isActive: true,
        createdAt: new Date(),
      }

      if (userType === "supplier" || userType === "rider") {
        (demoUser as any).reliabilityScore = 4.5
      }

      userRecord = {
        password: password,
        userData: demoUser,
      }

      // Save the new user
      users[email.toLowerCase()] = userRecord
      this.saveStoredUsers(users)
    }

    this.currentUser = userRecord.userData
    this.isAuthenticated = true
    this.saveToStorage()

    return { success: true, user: userRecord.userData }
  }

  async register(
    userData: Omit<User, "id" | "createdAt">,
    password: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = this.getStoredUsers()
    const email = userData.email.toLowerCase()

    // For demo purposes, allow re-registration (overwrite existing users)
    const newUser: User = {
      ...userData,
      id: `${userData.type}_${Date.now()}`,
      createdAt: new Date(),
    }

    users[email] = {
      password,
      userData: newUser,
    }

    this.saveStoredUsers(users)
    this.currentUser = newUser
    this.isAuthenticated = true
    this.saveToStorage()

    return { success: true, user: newUser }
  }

  logout(): void {
    this.currentUser = null
    this.isAuthenticated = false
    this.saveToStorage()
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated && this.currentUser !== null
  }

  private clearStorage(): void {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    localStorage.removeItem(STORAGE_KEY)
    this.currentUser = null
    this.isAuthenticated = false
  }
}

export const authService = new AuthService()
