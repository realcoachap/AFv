import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/schedule/stats
 * Get scheduling statistics for admin dashboard
 */
export async function GET(req: NextRequest) {
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

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfToday)
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Fetch all relevant stats in parallel
    const [
      totalUpcoming,
      todaySessions,
      thisWeekSessions,
      thisMonthSessions,
      pendingApprovals,
      recentSessions,
    ] = await Promise.all([
      // Total upcoming sessions
      prisma.appointment.count({
        where: {
          dateTime: { gte: now },
          status: { in: ['CONFIRMED', 'PENDING_APPROVAL'] },
        },
      }),
      // Today's sessions
      prisma.appointment.count({
        where: {
          dateTime: {
            gte: startOfToday,
            lt: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000),
          },
          status: { in: ['CONFIRMED', 'PENDING_APPROVAL'] },
        },
      }),
      // This week's sessions
      prisma.appointment.count({
        where: {
          dateTime: { gte: startOfWeek },
          status: { in: ['CONFIRMED', 'PENDING_APPROVAL'] },
        },
      }),
      // This month's sessions
      prisma.appointment.count({
        where: {
          dateTime: { gte: startOfMonth },
          status: { in: ['CONFIRMED', 'PENDING_APPROVAL'] },
        },
      }),
      // Pending approvals
      prisma.appointment.count({
        where: { status: 'PENDING_APPROVAL' },
      }),
      // Recent 5 sessions (for quick view)
      prisma.appointment.findMany({
        where: {
          dateTime: { gte: now },
        },
        include: {
          client: {
            select: {
              clientProfile: {
                select: { fullName: true },
              },
            },
          },
        },
        orderBy: { dateTime: 'asc' },
        take: 5,
      }),
    ])

    return NextResponse.json({
      stats: {
        totalUpcoming,
        todaySessions,
        thisWeekSessions,
        thisMonthSessions,
        pendingApprovals,
      },
      recentSessions,
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
