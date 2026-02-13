import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma, AppointmentStatus } from '@prisma/client'

/**
 * GET /api/schedule
 * Fetch sessions based on user role
 * - Clients see their own sessions
 * - Admins see all sessions (or filter by clientId query param)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Build query filters
    const where: Prisma.AppointmentWhereInput = {}

    // Role-based filtering
    if (user.role === 'CLIENT') {
      where.clientId = session.user.id
    } else if (clientId) {
      where.clientId = clientId
    }

    // Status filter
    if (status) {
      where.status = status as AppointmentStatus
    }

    // Date range filter
    if (from || to) {
      where.dateTime = {}
      if (from) where.dateTime.gte = new Date(from)
      if (to) where.dateTime.lte = new Date(to)
    }

    const appointments = await prisma.appointment.findMany({
      where,
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
      orderBy: { dateTime: 'asc' },
    })

    return NextResponse.json(
      { appointments },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Schedule fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/schedule
 * Create a new session (admin only for now)
 */
const createSessionSchema = z.object({
  clientId: z.string(),
  dateTime: z.string().transform((val) => new Date(val)),
  duration: z.number().min(15).max(180),
  sessionType: z.enum(['ONE_ON_ONE', 'GROUP', 'ASSESSMENT', 'CHECK_IN']),
  location: z.string().optional(),
  notes: z.string().optional(),
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

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = createSessionSchema.parse(body)

    const appointment = await prisma.appointment.create({
      data: {
        clientId: validatedData.clientId,
        adminId: session.user.id,
        dateTime: validatedData.dateTime,
        duration: validatedData.duration,
        sessionType: validatedData.sessionType,
        location: validatedData.location,
        notes: validatedData.notes,
        clientNotes: validatedData.clientNotes,
        status: 'CONFIRMED', // Admin-created sessions are auto-confirmed
        bookedBy: 'ADMIN',
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

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
