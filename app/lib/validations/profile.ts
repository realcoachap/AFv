import { z } from 'zod'

/**
 * Client-side validation schema for profile edits
 * All fields are optional (can be filled in person)
 * Validates types and basic constraints only
 */
export const profileSchema = z.object({
  // Personal Information
  fullName: z.string().min(1, 'Name is required').optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be under 120').nullable().optional(),
  gender: z.string().optional(),
  height: z.number().min(0, 'Height must be positive').nullable().optional(),
  heightUnit: z.enum(['inches', 'centimeters']),
  currentWeight: z.number().min(0, 'Weight must be positive').nullable().optional(),
  weightUnit: z.enum(['pounds', 'kilograms']),
  
  // Emergency Contact
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyRelationship: z.string().optional(),
  
  // Health & Medical
  hasMedicalConditions: z.boolean().nullable().optional(),
  medicalConditions: z.string().optional(),
  isTakingMedications: z.boolean().nullable().optional(),
  medications: z.string().optional(),
  hasInjuries: z.boolean().nullable().optional(),
  injuriesDescription: z.string().optional(),
  hasAllergies: z.boolean().nullable().optional(),
  allergies: z.string().optional(),
  fitnessLevel: z.string().optional(),
  
  // Fitness History
  hasWorkedOutBefore: z.boolean().nullable().optional(),
  previousExerciseTypes: z.string().optional(),
  hasHomeEquipment: z.boolean().nullable().optional(),
  homeEquipmentTypes: z.string().optional(),
  
  // Goals
  primaryGoal: z.string().optional(),
  secondaryGoals: z.string().optional(),
  targetTimeline: z.string().optional(),
  
  // Lifestyle
  typicalActivityLevel: z.string().optional(),
  averageSleepHours: z.number().min(0, 'Sleep hours must be positive').max(24, 'Sleep hours cannot exceed 24').nullable().optional(),
  dietaryRestrictions: z.string().optional(),
  
  // Preferences
  exerciseDaysPerWeek: z.number().min(0, 'Cannot be negative').max(7, 'Cannot exceed 7 days').nullable().optional(),
  preferredWorkoutDays: z.string().optional(),
  sessionsPerMonth: z.number().min(0, 'Cannot be negative').max(31, 'Cannot exceed 31 sessions').nullable().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

/**
 * Validate profile data and return formatted errors
 */
export function validateProfile(data: unknown) {
  try {
    profileSchema.parse(data)
    return { success: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const field = err.path.join('.')
        formattedErrors[field] = err.message
      })
      return { success: false, errors: formattedErrors }
    }
    return { success: false, errors: { _form: 'Validation failed' } }
  }
}
