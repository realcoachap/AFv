import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { onSessionComplete } from '@/app/lib/rpg/session-integration'
import { z } from 'zod'

const logWorkoutSchema = z.object({
  date: z.string(), // ISO date string
  focusType: z.enum(['STRENGTH', 'CARDIO', 'BALANCED']),
  duration: z.string().optional(),
  notes: z.string().optional(),
})

/**
 * POST /api/client/log-workout
 * Client logs a solo workout (not with coach)
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = logWorkoutSchema.parse(body)

    // Parse date
    const workoutDate = new Date(validatedData.date)
    
    // Validate date is within past 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today
    
    if (workoutDate < sevenDaysAgo || workoutDate > today) {
      return NextResponse.json(
        { error: 'Date must be within the past 7 days' },
        { status: 400 }
      )
    }

    // Create appointment as COMPLETED, SELF_LOGGED
    const appointment = await prisma.appointment.create({
      data: {
        clientId: session.user.id,
        dateTime: workoutDate,
        duration: validatedData.duration ? parseInt(validatedData.duration) : 60,
        sessionType: 'ONE_ON_ONE', // Default type
        focusType: validatedData.focusType,
        workoutType: 'SELF_LOGGED',
        status: 'COMPLETED',
        bookedBy: 'CLIENT',
        clientNotes: validatedData.notes || undefined,
      },
    })

    // Trigger RPG updates immediately
    const rpgResult = await onSessionComplete(
      appointment.id,
      session.user.id,
      validatedData.focusType,
      'SELF_LOGGED'
    )

    return NextResponse.json({
      success: true,
      appointment,
      rpg: rpgResult,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Log workout error:', error)
    return NextResponse.json(
      { error: 'Failed to log workout' },
      { status: 500 }
    )
  }
}
