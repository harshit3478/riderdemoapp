"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '@/lib/types'

interface AdminAuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  register: (userData: Omit<User, 'id' | 'createdAt'>, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

const STORAGE_KEY = 'fleetconnect_admin_auth'
const USERS_KEY = 'fleetconnect_admin_users'

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

export function AdminAuthProvider({ children }: { children: ReactNode }) {
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
      console.error('Failed to load admin auth from storage:', error)
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
      console.error('Failed to save admin auth to storage:', error)
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
      console.error('Failed to load admin users from storage:', error)
    }
    return {}
  }

  const saveStoredUsers = (users: StoredUsers): void => {
    if (typeof window === 'undefined') return

    try {
      const encoded = encode(JSON.stringify(users))
      localStorage.setItem(USERS_KEY, encoded)
    } catch (error) {
      console.error('Failed to save admin users to storage:', error)
    }
  }

  const initializeDefaultUsers = (): void => {
    const existingUsers = getStoredUsers()

    const defaultUser = {
      email: 'admin@fleetconnect.com',
      password: 'admin123',
      userData: {
        id: 'admin_demo',
        name: 'Demo Admin',
        email: 'admin@fleetconnect.com',
        company: 'FleetConnect',
        location: 'Bangalore',
        type: 'admin' as const,
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
        // Create a demo admin user on the fly
        const demoUser: User = {
          id: `admin_${Date.now()}`,
          name: 'Demo Admin',
          email: email,
          company: 'FleetConnect',
          location: 'Bangalore',
          type: 'admin',
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

      // Ensure user type is admin
      if (userRecord.userData.type !== 'admin') {
        return { success: false, error: 'Invalid user type for admin login' }
      }

      setUser(userRecord.userData)
      setIsAuthenticated(true)
      saveToStorage(userRecord.userData, true)

      return { success: true, user: userRecord.userData }
    } catch (error) {
      console.error('Admin login failed:', error)
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

      // Ensure user type is admin
      if (userData.type !== 'admin') {
        return { success: false, error: 'Invalid user type for admin registration' }
      }

      const newUser: User = {
        ...userData,
        id: `admin_${Date.now()}`,
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
      console.error('Admin registration failed:', error)
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

  const value: AdminAuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    isLoading,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
