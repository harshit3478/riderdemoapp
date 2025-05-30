'use client'

import { useEffect, useState } from 'react'
import { dataStore } from '@/lib/data-store'

export function useDataStore() {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize client-side data when component mounts
    dataStore.initializeClientData()
    setIsInitialized(true)
  }, [])

  return {
    dataStore,
    isInitialized
  }
}
