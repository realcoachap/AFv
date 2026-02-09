import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

/**
 * POST /api/client/booking
 * Client requests a new session (status: PENDING_APPROVAL)
 */
const createBookingSchema = z.object({
  dateTime: z.string().transform((val) => new Date(val)),
  duration: z.number().min(15).max(180),
  sessionType: z.enum(['ONE_ON_ONE', 'GROUP', 'ASSESSMENT', 'CHECK_IN']),
  clientNotes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Client access required' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = createBookingSchema.parse(body)

    // Check if date is in the future
    if (validatedData.dateTime <= new Date()) {
      return NextResponse.json(
        { error: 'Cannot book sessions in the past' },
        { status: 400 }
      )
    }

    // Create appointment with PENDING_APPROVAL status
    const appointment = await prisma.appointment.create({
      data: {
        clientId: session.user.id,
        dateTime: validatedData.dateTime,
        duration: validatedData.duration,
        sessionType: validatedData.sessionType,
        clientNotes: validatedData.clientNotes,
        status: 'PENDING_APPROVAL',
        bookedBy: 'CLIENT',
      },
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

    console.log('📅 New booking request:', {
      appointmentId: appointment.id,
      client: appointment.client.clientProfile?.fullName || appointment.client.email,
      dateTime: appointment.dateTime,
      status: appointment.status,
    })

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
