import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { onSessionComplete } from '@/app/lib/rpg/session-integration'
import { Prisma } from '@prisma/client'

/**
 * GET /api/schedule/[id]
 * Fetch a single session
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            clientProfile: {
              select: {
                fullName: true,
                phone: true,
              },
            },
          },
        },
        admin: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check access
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (
      user?.role !== 'ADMIN' &&
      appointment.clientId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/schedule/[id]
 * Update a session (admin only)
 */
const updateSessionSchema = z.object({
  dateTime: z.string().transform((val) => new Date(val)).optional(),
  duration: z.number().min(15).max(180).optional(),
  sessionType: z.enum(['ONE_ON_ONE', 'GROUP', 'ASSESSMENT', 'CHECK_IN']).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  clientNotes: z.string().optional(),
  status: z
    .enum([
      'PENDING_APPROVAL',
      'CONFIRMED',
      'COMPLETED',
      'CANCELLED',
      'REJECTED',
      'NO_SHOW',
    ])
    .optional(),
  cancelReason: z.string().optional(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = updateSessionSchema.parse(body)

    const { id } = await params
    // Check if session exists
    const existing = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // If marking as cancelled, set cancelledAt
    const updateData: Prisma.AppointmentUpdateInput = { ...validatedData }
    if (
      validatedData.status === 'CANCELLED' &&
      !existing.cancelledAt
    ) {
      updateData.cancelledAt = new Date()
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            email: true,
            clientProfile: {
              select: {
                fullName: true,
                phone: true,
              },
            },
          },
        },
      },
    })

    // Trigger RPG updates if session was just marked as COMPLETED
    if (
      validatedData.status === 'COMPLETED' &&
      existing.status !== 'COMPLETED'
    ) {
      try {
        const rpgResult = await onSessionComplete(
          id,
          appointment.clientId,
          appointment.focusType || undefined,
          appointment.workoutType
        )
        
        // Optionally attach RPG result to response
        return NextResponse.json({
          appointment,
          rpg: rpgResult.success ? rpgResult : undefined,
        })
      } catch (rpgError) {
        console.error('RPG update error (non-fatal):', rpgError)
        // Don't fail the request if RPG update fails
        return NextResponse.json({ appointment })
      }
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Session update error:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/schedule/[id]
 * Delete/cancel a session (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const cancelReason = searchParams.get('reason')

    const { id } = await params
    // Soft delete: mark as cancelled instead of actually deleting
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: cancelReason || undefined,
      },
    })

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Session deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel session' },
      { status: 500 }
    )
  }
}
