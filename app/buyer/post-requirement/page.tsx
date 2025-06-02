'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/breadcrumb'
import { mockLocations } from '@/lib/data/mockData'
import { generateId } from '@/lib/utils'
import { validateRequirementForm, ValidationError } from '@/lib/utils/validation'
import { Requirement } from '@/lib/types'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import { useRestaurantAuth } from '@/hooks/useRestaurantAuth'
import { useDataStore } from '@/hooks/useDataStore'

export default function PostRequirement() {
  const router = useRouter()
  const { toast } = useToast()
  const { user: currentUser } = useRestaurantAuth()
  const { dataStore } = useDataStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])

  const [formData, setFormData] = useState({
    jobProfile: '',
    description: '',
    jobResponsibilities: '',
    jobLocation: '',
    ridersNeeded: '',
    date: '',
    startTime: '',
    endTime: '',
    applicationDeadline: '',
    preferredLanguages: [] as string[],
    vehicleRequired: false,
    dlRequired: false,
    minimumExperience: '',
    pay: '',
    documentsRequired: {
      adhaarCard: false,
      panCard: false,
    },
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Auto-fill pincode when location is selected
    if (field === 'jobLocation') {
      const selectedLocation = mockLocations.find(loc => loc.name === value)
      if (selectedLocation) {
        // No pincode field in new form, so no update here
      }
    }
  }

  const handleDocumentChange = (doc: 'adhaarCard' | 'panCard', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      documentsRequired: {
        ...prev.documentsRequired,
        [doc]: checked,
      },
    }))
  }

  const handleLanguageAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const value = input.value.trim()
    if (e.key === 'Enter' && value && !formData.preferredLanguages.includes(value)) {
      setFormData(prev => ({
        ...prev,
        preferredLanguages: [...prev.preferredLanguages, value],
      }))
      input.value = ''
    }
  }

  const handleLanguageRemove = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.filter(l => l !== lang),
    }))
  }

  const fillSampleData = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    setFormData({
      jobProfile: 'Food Delivery Executive',
      description: 'We are looking for reliable food delivery executives to join our team. You will be responsible for picking up orders from restaurants and delivering them to customers in a timely manner.',
      jobResponsibilities: 'Pick up food orders from partner restaurants, Deliver orders to customers safely and on time, Maintain professional communication with customers, Handle cash and digital payments, Ensure food quality during transport',
      jobLocation: 'Bangalore, Karnataka',
      ridersNeeded: '5',
      date: tomorrow.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '21:00',
      applicationDeadline: nextWeek.toISOString().split('T')[0],
      preferredLanguages: ['English', 'Hindi', 'Kannada'],
      vehicleRequired: true,
      dlRequired: true,
      minimumExperience: '6 months',
      pay: '25000',
      documentsRequired: {
        adhaarCard: true,
        panCard: false,
      },
    })
  }

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field.toLowerCase().includes(fieldName.toLowerCase()))?.message
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validation = validateRequirementForm(formData)
    setErrors(validation.errors)

    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newRequirement: Requirement = {
        id: generateId(),
        buyerId: currentUser!.id,
        buyerCompany: 'Anonymous Buyer', // Keep anonymous as per PRD
        title: formData.jobProfile,
        description: formData.description,
        quantity: parseInt(formData.ridersNeeded),
        location: formData.jobLocation,
        pincode: '', // No pincode field in new form
        startDate: new Date(formData.date),
        endDate: new Date(formData.applicationDeadline),
        startTime: formData.startTime,
        endTime: formData.endTime,
        ratePerHour: parseInt(formData.pay),
        language: formData.preferredLanguages.join(', '),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        bids: [],
      }

      dataStore.addRequirement(newRequirement)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Success!",
        description: "Your job requirement has been posted successfully.",
      })

      router.push('/buyer/requirements')
    } catch (error) {
      console.error('Error posting requirement:', error)
      toast({
        title: "Error",
        description: "Failed to post requirement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title="Post New Requirement"
        description="Create a delivery requirement to connect with riders and fleet managers"
        breadcrumbs={[
          { label: 'Dashboard', href: '/buyer/dashboard' },
          { label: 'Post Requirement', current: true }
        ]}
        actions={
          <>
            {/* Desktop Actions */}
            <div className="hidden md:flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fillSampleData}
                type="button"
              >
                Fill Sample Data
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            
            {/* Mobile Actions */}
            <div className="flex md:hidden flex-col space-y-2 w-full">
              {/* <Button
                variant="ghost"
                onClick={() => router.back()}
                className="justify-start"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button> */}
              <Button
                variant="outline"
                onClick={fillSampleData}
                type="button"
                className="w-[80%]"
              >
                Fill Sample Data
              </Button>
            </div>
          </>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Profile */}
        <div>
          <Label htmlFor="jobProfile">Job Profile</Label>
          <Input
            id="jobProfile"
            type="text"
            value={formData.jobProfile}
            onChange={e => handleInputChange('jobProfile', e.target.value)}
            placeholder="Enter job profile"
            className={getFieldError('job profile') ? 'border-destructive' : ''}
            required
          />
          {getFieldError('job profile') && (
            <p className="text-sm text-destructive mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('job profile')}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-foreground rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            placeholder="Enter job description"
          />
        </div>

        {/* Job Responsibilities */}
        <div>
          <Label htmlFor="jobResponsibilities">Job Responsibilities</Label>
          <textarea
            id="jobResponsibilities"
            className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-foreground rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
            value={formData.jobResponsibilities}
            onChange={e => handleInputChange('jobResponsibilities', e.target.value)}
            placeholder="Enter job responsibilities"
          />
        </div>

        {/* Job Location */}
        <div>
          <Label htmlFor="jobLocation">Job Location</Label>
          <Input
            id="jobLocation"
            type="text"
            value={formData.jobLocation}
            onChange={e => handleInputChange('jobLocation', e.target.value)}
            placeholder="Enter job location"
            required
          />
        </div>

        {/* Riders Needed */}
        <div>
          <Label htmlFor="ridersNeeded">Riders Needed</Label>
          <Input
            id="ridersNeeded"
            type="number"
            min="1"
            value={formData.ridersNeeded}
            onChange={e => handleInputChange('ridersNeeded', e.target.value)}
            placeholder="Enter number of riders needed"
            className={getFieldError('riders') ? 'border-destructive' : ''}
            required
          />
          {getFieldError('riders') && (
            <p className="text-sm text-destructive mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {getFieldError('riders')}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={e => handleInputChange('date', e.target.value)}
            required
          />
        </div>

        {/* Timings */}
        <div className="flex space-x-2 items-center">
          <div className="flex-1">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={e => handleInputChange('startTime', e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={e => handleInputChange('endTime', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Application Deadline */}
        <div>
          <Label htmlFor="applicationDeadline">Application Deadline</Label>
          <Input
            id="applicationDeadline"
            type="date"
            value={formData.applicationDeadline}
            onChange={e => handleInputChange('applicationDeadline', e.target.value)}
            required
          />
        </div>

        {/* Preferred Languages */}
        <div>
          <Label>Preferred Languages</Label>
          <input
            type="text"
            placeholder="Type language and press Enter"
            onKeyDown={handleLanguageAdd}
            className="w-full h-9 px-3 py-1 border border-input bg-background text-foreground rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.preferredLanguages.map(lang => (
              <div key={lang} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center space-x-2">
                <span>{lang}</span>
                <button
                  onClick={() => handleLanguageRemove(lang)}
                  className="font-bold hover:text-destructive transition-colors"
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Riders Requirements */}
        <div>
          <Label>Riders Requirements</Label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.vehicleRequired}
                onChange={e => handleInputChange('vehicleRequired', e.target.checked)}
              />
              <span>Vehicle Required</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.dlRequired}
                onChange={e => handleInputChange('dlRequired', e.target.checked)}
              />
              <span>DL Required</span>
            </label>
            <div className="flex-1 min-w-0">
              <Input
                type="text"
                placeholder="Minimum Experience"
                value={formData.minimumExperience}
                onChange={e => handleInputChange('minimumExperience', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Pay */}
        <div>
          <Label htmlFor="pay">Pay</Label>
          <Input
            id="pay"
            type="number"
            min="0"
            value={formData.pay}
            onChange={e => handleInputChange('pay', e.target.value)}
            placeholder="Enter pay"
            required
          />
        </div>

        {/* Documents Required */}
        <div>
          <Label>Documents Required</Label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.documentsRequired.adhaarCard}
                onChange={e => handleDocumentChange('adhaarCard', e.target.checked)}
              />
              <span>Adhaar Card</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.documentsRequired.panCard}
                onChange={e => handleDocumentChange('panCard', e.target.checked)}
              />
              <span>PAN Card</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Requirement'}
          </Button>
        </div>
      </form>
    </div>
  )
}
