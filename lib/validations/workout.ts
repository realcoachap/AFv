import { z } from 'zod'

// Set validation schema
export const setSchema = z.object({
  setNumber: z.number().int().min(1),
  reps: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  weightUnit: z.enum(['lbs', 'kg', 'bodyweight']).default('lbs'),
  duration: z.number().int().min(0).optional(), // in seconds
  distance: z.number().min(0).optional(),
  completed: z.boolean().default(true),
  rpe: z.number().int().min(1).max(10).optional(),
  notes: z.string().max(500).optional(),
})

// Exercise validation schema
export const exerciseSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.enum(['STRENGTH', 'CARDIO', 'FLEXIBILITY', 'BALANCE', 'SPORT', 'OTHER']),
  duration: z.number().int().min(0).optional(), // in minutes for cardio
  distance: z.number().min(0).optional(),
  distanceUnit: z.enum(['km', 'miles', 'meters']).optional(),
  notes: z.string().max(1000).optional(),
  order: z.number().int().min(0).default(0),
  sets: z.array(setSchema).default([]),
})

// Create workout validation schema
export const createWorkoutSchema = z.object({
  name: z.string().min(1).max(200),
  notes: z.string().max(2000).optional(),
  date: z.string().datetime().or(z.date()),
  duration: z.number().int().min(0).optional(),
  type: z.enum(['COACHED', 'SELF_LOGGED']).default('SELF_LOGGED'),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('COMPLETED'),
  focusType: z.enum(['STRENGTH', 'CARDIO', 'BALANCED']).optional(),
  exercises: z.array(exerciseSchema).min(1, 'At least one exercise is required'),
})

// Update workout validation schema (all fields optional)
export const updateWorkoutSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  notes: z.string().max(2000).optional(),
  date: z.string().datetime().or(z.date()).optional(),
  duration: z.number().int().min(0).optional(),
  type: z.enum(['COACHED', 'SELF_LOGGED']).optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  focusType: z.enum(['STRENGTH', 'CARDIO', 'BALANCED']).optional(),
  exercises: z.array(exerciseSchema).optional(),
})

// Query params validation for listing workouts
export const workoutQuerySchema = z.object({
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().int().min(0)).optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  focusType: z.enum(['STRENGTH', 'CARDIO', 'BALANCED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  orderBy: z.enum(['date', 'createdAt']).default('date'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// Export types
export type SetInput = z.infer<typeof setSchema>
export type ExerciseInput = z.infer<typeof exerciseSchema>
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>
export type WorkoutQueryParams = z.infer<typeof workoutQuerySchema>
