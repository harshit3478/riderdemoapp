"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useDataStore } from "@/hooks/useDataStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"
import { 
  Shield, 
  Activity, 
  Server, 
  Database, 
  Users, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"

interface SystemMetric {
  name: string
  value: string | number
  status: 'healthy' | 'warning' | 'error'
  lastUpdated: Date
  description: string
}

export default function AdminSystem() {
  const router = useRouter()
  const { user: currentUser } = useAdminAuth()
  const { dataStore, isInitialized } = useDataStore()
  const [loading, setLoading] = useState(true)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])

  const loadData = useCallback(async () => {
    if (!isInitialized || !currentUser) return

    try {
      setLoading(true)
      
      // Mock system metrics - in a real app, these would come from monitoring APIs
      const requirements = dataStore.getRequirements()
      const bids = dataStore.getBids()
      const riderApplications = dataStore.getRiderApplications()

      const metrics: SystemMetric[] = [
        {
          name: "API Response Time",
          value: "145ms",
          status: "healthy",
          lastUpdated: new Date(),
          description: "Average API response time"
        },
        {
          name: "Database Connections",
          value: "23/100",
          status: "healthy", 
          lastUpdated: new Date(),
          description: "Active database connections"
        },
        {
          name: "Memory Usage",
          value: "68%",
          status: "warning",
          lastUpdated: new Date(),
          description: "Server memory utilization"
        },
        {
          name: "Active Users",
          value: 156,
          status: "healthy",
          lastUpdated: new Date(),
          description: "Currently active platform users"
        },
        {
          name: "Requirements Processing",
          value: `${requirements.length} total`,
          status: "healthy",
          lastUpdated: new Date(),
          description: "Total requirements in system"
        },
        {
          name: "Bid Success Rate",
          value: "87%",
          status: "healthy",
          lastUpdated: new Date(),
          description: "Percentage of successful bid matches"
        },
        {
          name: "Error Rate",
          value: "0.02%",
          status: "healthy",
          lastUpdated: new Date(),
          description: "System error rate (last 24h)"
        },
        {
          name: "Uptime",
          value: "99.9%",
          status: "healthy",
          lastUpdated: new Date(),
          description: "System uptime (last 30 days)"
        }
      ]

      setSystemMetrics(metrics)
    } catch (err) {
      console.error("Failed to load system metrics:", err)
    } finally {
      setLoading(false)
    }
  }, [currentUser, isInitialized, dataStore])

  useEffect(() => {
    if (!currentUser || currentUser.type !== "admin") {
      router.push("/admin/login")
      return
    }
    loadData()
  }, [currentUser, router, loadData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-status-completed text-status-completed-foreground'
      case 'warning': return 'bg-status-pending text-status-pending-foreground'
      case 'error': return 'bg-status-cancelled text-status-cancelled-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'error': return <AlertTriangle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getOverallHealth = () => {
    const healthyCount = systemMetrics.filter(m => m.status === 'healthy').length
    const warningCount = systemMetrics.filter(m => m.status === 'warning').length
    const errorCount = systemMetrics.filter(m => m.status === 'error').length

    if (errorCount > 0) return { status: 'error', message: 'System Issues Detected' }
    if (warningCount > 0) return { status: 'warning', message: 'Performance Warnings' }
    return { status: 'healthy', message: 'All Systems Operational' }
  }

  const overallHealth = getOverallHealth()

  if (!currentUser || currentUser.type !== "admin") {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Health</h1>
        <p className="text-muted-foreground">Monitor platform performance and system metrics</p>
      </div>

      {/* Overall Health Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${getStatusColor(overallHealth.status)}`}>
                {getStatusIcon(overallHealth.status)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{overallHealth.message}</h3>
                <p className="text-sm text-muted-foreground">
                  Last updated: {formatDateTime(new Date())}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(overallHealth.status)}>
              {overallHealth.status.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          systemMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-foreground">{metric.name}</h4>
                  <Badge className={getStatusColor(metric.status)} variant="outline">
                    {getStatusIcon(metric.status)}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {metric.value}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {metric.description}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDateTime(metric.lastUpdated)}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* System Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5 text-primary" />
              Infrastructure
            </CardTitle>
            <CardDescription>Core system components status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Web Server", status: "healthy", uptime: "99.9%" },
              { name: "Load Balancer", status: "healthy", uptime: "100%" },
              { name: "CDN", status: "healthy", uptime: "99.8%" },
              { name: "Monitoring", status: "healthy", uptime: "99.9%" }
            ].map((component, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${component.status === 'healthy' ? 'bg-primary' : 'bg-destructive'}`}></div>
                  <span className="font-medium text-foreground">{component.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {component.uptime} uptime
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-secondary" />
              Data Services
            </CardTitle>
            <CardDescription>Database and storage systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Primary Database", status: "healthy", connections: "23/100" },
              { name: "Redis Cache", status: "healthy", connections: "12/50" },
              { name: "File Storage", status: "healthy", usage: "45%" },
              { name: "Backup System", status: "healthy", lastBackup: "2 hours ago" }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${service.status === 'healthy' ? 'bg-secondary' : 'bg-destructive'}`}></div>
                  <span className="font-medium text-foreground">{service.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {service.connections || service.usage || service.lastBackup}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
