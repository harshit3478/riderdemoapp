'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Home, 
  ArrowLeft, 
  Search, 
  FileText, 
  Users,
  AlertTriangle 
} from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/')
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleBrowseJobs = () => {
    router.push('/rider/gigs')
  }

  const handleBrowseRequirements = () => {
    router.push('/supplier/browse')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Main Error Card */}
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">
              404 - Page Not Found
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Oops! The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Don't worry, you can navigate back to safety using the options below.
            </p>
            
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleGoHome}
                className="flex items-center gap-2"
                size="lg"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGoBack}
                className="flex items-center gap-2"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow group" onClick={handleBrowseJobs}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Browse Gigs</h3>
                  <p className="text-sm text-muted-foreground">Find delivery opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow group" onClick={handleBrowseRequirements}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Browse Requirements</h3>
                  <p className="text-sm text-muted-foreground">Find delivery contracts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow group sm:col-span-2 lg:col-span-1" onClick={() => router.push('/admin/dashboard')}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Admin Portal</h3>
                  <p className="text-sm text-muted-foreground">Manage the platform</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Text */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h4 className="font-medium text-foreground">Need Help?</h4>
              <p className="text-sm text-muted-foreground">
                If you believe this is an error, please contact our support team or try refreshing the page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
