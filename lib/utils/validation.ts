export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export const validateRequired = (value: string, fieldName: string): ValidationError | null => {
  if (!value || value.trim() === '') {
    return { field: fieldName, message: `${fieldName} is required` }
  }
  return null
}

export const validateEmail = (email: string): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address' }
  }
  return null
}

export const validateNumber = (value: string, fieldName: string, min?: number, max?: number): ValidationError | null => {
  const num = parseInt(value)
  if (isNaN(num)) {
    return { field: fieldName, message: `${fieldName} must be a valid number` }
  }
  if (min !== undefined && num < min) {
    return { field: fieldName, message: `${fieldName} must be at least ${min}` }
  }
  if (max !== undefined && num > max) {
    return { field: fieldName, message: `${fieldName} must be at most ${max}` }
  }
  return null
}

export const validateDate = (dateString: string, fieldName: string): ValidationError | null => {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return { field: fieldName, message: `${fieldName} must be a valid date` }
  }
  return null
}

export const validateFutureDate = (dateString: string, fieldName: string): ValidationError | null => {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (date < today) {
    return { field: fieldName, message: `${fieldName} must be in the future` }
  }
  return null
}

export const validateTime = (timeString: string, fieldName: string): ValidationError | null => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(timeString)) {
    return { field: fieldName, message: `${fieldName} must be in HH:MM format` }
  }
  return null
}

export const validateRequirementForm = (formData: any): ValidationResult => {
  const errors: ValidationError[] = []

  // Required fields
  const requiredFields = [
    { value: formData.jobProfile, name: 'Job Profile' },
    { value: formData.ridersNeeded, name: 'Number of Riders' },
    { value: formData.pay, name: 'Pay Rate' },
    { value: formData.jobLocation, name: 'Job Location' },
    { value: formData.date, name: 'Date' },
    { value: formData.startTime, name: 'Start Time' },
    { value: formData.endTime, name: 'End Time' },
    { value: formData.applicationDeadline, name: 'Application Deadline' }
  ]

  requiredFields.forEach(field => {
    const error = validateRequired(field.value, field.name)
    if (error) errors.push(error)
  })

  // Number validations
  if (formData.ridersNeeded) {
    const error = validateNumber(formData.ridersNeeded, 'Number of Riders', 1, 1000)
    if (error) errors.push(error)
  }

  if (formData.pay) {
    const error = validateNumber(formData.pay, 'Pay Rate', 1, 10000)
    if (error) errors.push(error)
  }

  // Date validations
  if (formData.date) {
    const dateError = validateDate(formData.date, 'Date')
    if (dateError) {
      errors.push(dateError)
    } else {
      const futureError = validateFutureDate(formData.date, 'Date')
      if (futureError) errors.push(futureError)
    }
  }

  if (formData.applicationDeadline) {
    const dateError = validateDate(formData.applicationDeadline, 'Application Deadline')
    if (dateError) {
      errors.push(dateError)
    } else {
      const futureError = validateFutureDate(formData.applicationDeadline, 'Application Deadline')
      if (futureError) errors.push(futureError)
    }
  }

  // Time validations
  if (formData.startTime) {
    const error = validateTime(formData.startTime, 'Start Time')
    if (error) errors.push(error)
  }

  if (formData.endTime) {
    const error = validateTime(formData.endTime, 'End Time')
    if (error) errors.push(error)
  }

  // Cross-field validations
  if (formData.date && formData.applicationDeadline) {
    const jobDate = new Date(formData.date)
    const deadlineDate = new Date(formData.applicationDeadline)
    
    if (deadlineDate > jobDate) {
      errors.push({
        field: 'applicationDeadline',
        message: 'Application deadline must be before the job date'
      })
    }
  }

  if (formData.startTime && formData.endTime) {
    const [startHour, startMin] = formData.startTime.split(':').map(Number)
    const [endHour, endMin] = formData.endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    if (endMinutes <= startMinutes) {
      errors.push({
        field: 'endTime',
        message: 'End time must be after start time'
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
