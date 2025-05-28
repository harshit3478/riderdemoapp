'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { User, UserType, Requirement, Bid, RiderApplication, Notification } from '@/lib/types'

interface AppState {
  currentUser: User | null
  users: User[]
  requirements: Requirement[]
  bids: Bid[]
  riderApplications: RiderApplication[]
  notifications: Notification[]
  isLoading: boolean
}

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'SET_REQUIREMENTS'; payload: Requirement[] }
  | { type: 'ADD_REQUIREMENT'; payload: Requirement }
  | { type: 'UPDATE_REQUIREMENT'; payload: { id: string; updates: Partial<Requirement> } }
  | { type: 'SET_BIDS'; payload: Bid[] }
  | { type: 'ADD_BID'; payload: Bid }
  | { type: 'UPDATE_BID'; payload: { id: string; updates: Partial<Bid> } }
  | { type: 'SET_RIDER_APPLICATIONS'; payload: RiderApplication[] }
  | { type: 'ADD_RIDER_APPLICATION'; payload: RiderApplication }
  | { type: 'UPDATE_RIDER_APPLICATION'; payload: { id: string; updates: Partial<RiderApplication> } }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: AppState = {
  currentUser: null,
  users: [],
  requirements: [],
  bids: [],
  riderApplications: [],
  notifications: [],
  isLoading: false,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload }
    case 'SET_USERS':
      return { ...state, users: action.payload }
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] }
    case 'SET_REQUIREMENTS':
      return { ...state, requirements: action.payload }
    case 'ADD_REQUIREMENT':
      return { ...state, requirements: [...state.requirements, action.payload] }
    case 'UPDATE_REQUIREMENT':
      return {
        ...state,
        requirements: state.requirements.map(req =>
          req.id === action.payload.id ? { ...req, ...action.payload.updates } : req
        )
      }
    case 'SET_BIDS':
      return { ...state, bids: action.payload }
    case 'ADD_BID':
      return { ...state, bids: [...state.bids, action.payload] }
    case 'UPDATE_BID':
      return {
        ...state,
        bids: state.bids.map(bid =>
          bid.id === action.payload.id ? { ...bid, ...action.payload.updates } : bid
        )
      }
    case 'SET_RIDER_APPLICATIONS':
      return { ...state, riderApplications: action.payload }
    case 'ADD_RIDER_APPLICATION':
      return { ...state, riderApplications: [...state.riderApplications, action.payload] }
    case 'UPDATE_RIDER_APPLICATION':
      return {
        ...state,
        riderApplications: state.riderApplications.map(app =>
          app.id === action.payload.id ? { ...app, ...action.payload.updates } : app
        )
      }
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] }
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, isRead: true } : notif
        )
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  login: (userType: UserType, userData?: Partial<User>) => void
  logout: () => void
} | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      dispatch({ type: 'SET_CURRENT_USER', payload: JSON.parse(savedUser) })
    }
  }, [])

  // Save current user to localStorage
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [state.currentUser])

  const login = (userType: UserType, userData?: Partial<User>) => {
    const user: User = {
      id: userData?.id || `${userType}_${Date.now()}`,
      name: userData?.name || `${userType.charAt(0).toUpperCase() + userType.slice(1)} User`,
      email: userData?.email || `${userType}@example.com`,
      type: userType,
      company: userData?.company,
      phone: userData?.phone,
      location: userData?.location,
      reliabilityScore: userData?.reliabilityScore || 4.5,
      isActive: true,
      createdAt: new Date(),
      ...userData,
    }
    dispatch({ type: 'SET_CURRENT_USER', payload: user })
  }

  const logout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null })
  }

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
