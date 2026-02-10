import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { onSessionComplete } from '@/app/lib/rpg/session-integration'
import { prisma } from '@/lib/prisma'

/**
 * Trigger RPG updates when a session is marked complete
 * Called by admin when marking session status as COMPLETED
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      )
    }

    // Get session details
    const appointment = await prisma.appointment.findUnique({
      where: { id: sessionId },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (appointment.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Session must be marked COMPLETED first' },
        { status: 400 }
      )
    }

    // Process RPG updates
    const result = await onSessionComplete(
      sessionId,
      appointment.clientId,
      appointment.sessionType
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to process RPG updates' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error('Error in /api/rpg/session-complete:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
