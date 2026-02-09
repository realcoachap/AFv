import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/profile - Get current user's profile
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update current user's profile
const profileUpdateSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  age: z.number().int().positive().optional().or(z.literal(null)),
  gender: z.string().optional().or(z.literal(null)),
  height: z.number().positive().optional().or(z.literal(null)),
  heightUnit: z.enum(['inches', 'centimeters']).optional().or(z.literal(null)),
  currentWeight: z.number().positive().optional().or(z.literal(null)),
  weightUnit: z.enum(['pounds', 'kilograms']).optional().or(z.literal(null)),
  emergencyContact: z.string().optional().or(z.literal(null)),
  emergencyPhone: z.string().optional().or(z.literal(null)),
  emergencyRelationship: z.string().optional().or(z.literal(null)),
  hasMedicalConditions: z.boolean().optional().or(z.literal(null)),
  medicalConditions: z.string().optional().or(z.literal(null)),
  isTakingMedications: z.boolean().optional().or(z.literal(null)),
  medications: z.string().optional().or(z.literal(null)),
  hasInjuries: z.boolean().optional().or(z.literal(null)),
  injuriesDescription: z.string().optional().or(z.literal(null)),
  hasAllergies: z.boolean().optional().or(z.literal(null)),
  allergies: z.string().optional().or(z.literal(null)),
  fitnessLevel: z.string().optional().or(z.literal(null)),
  hasWorkedOutBefore: z.boolean().optional().or(z.literal(null)),
  previousExerciseTypes: z.string().optional().or(z.literal(null)),
  hasHomeEquipment: z.boolean().optional().or(z.literal(null)),
  homeEquipmentTypes: z.string().optional().or(z.literal(null)),
  primaryGoal: z.string().optional().or(z.literal(null)),
  secondaryGoals: z.string().optional().or(z.literal(null)),
  targetTimeline: z.string().optional().or(z.literal(null)),
  typicalActivityLevel: z.string().optional().or(z.literal(null)),
  averageSleepHours: z.number().positive().optional().or(z.literal(null)),
  dietaryRestrictions: z.string().optional().or(z.literal(null)),
  exerciseDaysPerWeek: z.number().int().positive().optional().or(z.literal(null)),
  preferredWorkoutDays: z.string().optional().or(z.literal(null)),
  sessionsPerMonth: z.number().int().positive().optional().or(z.literal(null)),
})

export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = profileUpdateSchema.parse(body)

    // Update profile
    const updatedProfile = await prisma.clientProfile.update({
      where: { userId: session.user.id },
      data: validatedData,
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
