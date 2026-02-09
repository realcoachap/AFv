import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'
import { z } from 'zod'

/**
 * GET /api/schedule/[id]
 * Fetch a single session
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
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

    // Check if session exists
    const existing = await prisma.appointment.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // If marking as cancelled, set cancelledAt
    const updateData: any = { ...validatedData }
    if (
      validatedData.status === 'CANCELLED' &&
      !existing.cancelledAt
    ) {
      updateData.cancelledAt = new Date()
    }

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
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

    return NextResponse.json({ appointment })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
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

    // Soft delete: mark as cancelled instead of actually deleting
    const appointment = await prisma.appointment.update({
      where: { id: params.id },
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
