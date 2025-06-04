"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '@/lib/types'

interface FleetAuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  register: (userData: Omit<User, 'id' | 'createdAt'>, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => void
  isLoading: boolean
}

const FleetAuthContext = createContext<FleetAuthContextType | undefined>(undefined)

const STORAGE_KEY = 'fleetconnect_fleet_auth'
const USERS_KEY = 'fleetconnect_fleet_users'

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

export function FleetAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFromStorage()
    initializeDefaultUsers()
    setIsLoading(false)
  }, [])

  const loadFromStorage = (): void => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const decoded = decode(stored)
        const authData: StoredAuth = JSON.parse(decoded)
        setUser(authData.currentUser)
        setIsAuthenticated(authData.isAuthenticated)
      }
    } catch (error) {
      console.error('Failed to load fleet auth from storage:', error)
      clearStorage()
    }
  }

  const saveToStorage = (userData: User | null, authenticated: boolean): void => {
    if (typeof window === 'undefined') return

    try {
      const authData: StoredAuth = {
        currentUser: userData,
        isAuthenticated: authenticated,
      }
      const encoded = encode(JSON.stringify(authData))
      localStorage.setItem(STORAGE_KEY, encoded)
    } catch (error) {
      console.error('Failed to save fleet auth to storage:', error)
    }
  }

  const getStoredUsers = (): StoredUsers => {
    if (typeof window === 'undefined') return {}

    try {
      const stored = localStorage.getItem(USERS_KEY)
      if (stored) {
        const decoded = decode(stored)
        return JSON.parse(decoded)
      }
    } catch (error) {
      console.error('Failed to load fleet users from storage:', error)
    }
    return {}
  }

  const saveStoredUsers = (users: StoredUsers): void => {
    if (typeof window === 'undefined') return

    try {
      const encoded = encode(JSON.stringify(users))
      localStorage.setItem(USERS_KEY, encoded)
    } catch (error) {
      console.error('Failed to save fleet users to storage:', error)
    }
  }

  const initializeDefaultUsers = (): void => {
    const existingUsers = getStoredUsers()

    const defaultUser = {
      email: 'supplier@example.com',
      password: 'password123',
      userData: {
        id: 'supplier_demo',
        name: 'Demo Fleet',
        email: 'supplier@example.com',
        company: 'Demo Fleet Services',
        location: 'Bangalore',
        reliabilityScore: 4.5,
        type: 'supplier' as const,
        isActive: true,
        createdAt: new Date(),
      },
    }

    if (!existingUsers[defaultUser.email]) {
      existingUsers[defaultUser.email] = {
        password: defaultUser.password,
        userData: defaultUser.userData,
      }
      saveStoredUsers(existingUsers)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const users = getStoredUsers()
      let userRecord = users[email.toLowerCase()]

      if (!userRecord) {
        // Create a demo fleet user on the fly
        const demoUser: User = {
          id: `supplier_${Date.now()}`,
          name: 'Demo Fleet',
          email: email,
          company: 'Demo Fleet Services',
          location: 'Bangalore',
          type: 'supplier',
          reliabilityScore: 4.5,
          isActive: true,
          createdAt: new Date(),
        }

        userRecord = {
          password: password,
          userData: demoUser,
        }

        users[email.toLowerCase()] = userRecord
        saveStoredUsers(users)
      }

      // Ensure user type is supplier (fleet) - support both legacy and new types
      if (userRecord.userData.type !== 'supplier' && userRecord.userData.type !== 'fleet') {
        return { success: false, error: 'Invalid user type for fleet login' }
      }

      setUser(userRecord.userData)
      setIsAuthenticated(true)
      saveToStorage(userRecord.userData, true)

      return { success: true, user: userRecord.userData }
    } catch (error) {
      console.error('Fleet login failed:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const register = async (
    userData: Omit<User, 'id' | 'createdAt'>,
    password: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const users = getStoredUsers()
      const email = userData.email.toLowerCase()

      // Ensure user type is supplier (fleet) - support both legacy and new types
      if (userData.type !== 'supplier' && userData.type !== 'fleet') {
        return { success: false, error: 'Invalid user type for fleet registration' }
      }

      const newUser: User = {
        ...userData,
        id: `supplier_${Date.now()}`,
        createdAt: new Date(),
      }

      users[email] = {
        password,
        userData: newUser,
      }

      saveStoredUsers(users)
      setUser(newUser)
      setIsAuthenticated(true)
      saveToStorage(newUser, true)

      return { success: true, user: newUser }
    } catch (error) {
      console.error('Fleet registration failed:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  const logout = (): void => {
    setUser(null)
    setIsAuthenticated(false)
    saveToStorage(null, false)
  }

  const clearStorage = (): void => {
    if (typeof window === 'undefined') return

    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setIsAuthenticated(false)
  }

  const value: FleetAuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    isLoading,
  }

  return <FleetAuthContext.Provider value={value}>{children}</FleetAuthContext.Provider>
}

export const useFleetAuth = () => {
  const context = useContext(FleetAuthContext)
  if (context === undefined) {
    throw new Error('useFleetAuth must be used within a FleetAuthProvider')
  }
  return context
}
