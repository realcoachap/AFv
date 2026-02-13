import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/admin/clients/[id] - Get specific client (admin only)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const client = await prisma.user.findUnique({
      where: { id },
      include: {
        clientProfile: true,
      },
    })

    if (!client || client.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { client },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Get client error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

const profileUpdateSchema = z.object({
  fullName: z.string().min(1).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    
    const validatedData = profileUpdateSchema.parse(body)

    // Check if client exists
    const client = await prisma.user.findUnique({
      where: { id },
      include: { clientProfile: true },
    })

    if (!client || client.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Update profile
    const updatedProfile = await prisma.clientProfile.update({
      where: { userId: id },
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

    console.error('Update client profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
