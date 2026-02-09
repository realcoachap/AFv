import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/clients - Get all clients (admin only)
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get search params
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    // Build where clause
    const where = search
      ? {
          role: 'CLIENT' as const,
          OR: [
            {
              email: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              clientProfile: {
                fullName: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            },
          ],
        }
      : {
          role: 'CLIENT' as const,
        }

    const clients = await prisma.user.findMany({
      where,
      include: {
        clientProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate profile completion for each client
    const clientsWithCompletion = clients.map((client) => {
      const profile = client.clientProfile
      if (!profile) {
        return { ...client, profileCompletion: 0 }
      }

      // Count filled fields (excluding id, userId, createdAt, updatedAt)
      const fields = [
        profile.fullName,
        profile.phone,
        profile.email,
        profile.age,
        profile.gender,
        profile.height,
        profile.currentWeight,
        profile.emergencyContact,
        profile.emergencyPhone,
        profile.emergencyRelationship,
        profile.hasMedicalConditions !== null ? true : null,
        profile.isTakingMedications !== null ? true : null,
        profile.hasInjuries !== null ? true : null,
        profile.hasAllergies !== null ? true : null,
        profile.fitnessLevel,
        profile.hasWorkedOutBefore !== null ? true : null,
        profile.hasHomeEquipment !== null ? true : null,
        profile.primaryGoal,
        profile.targetTimeline,
        profile.typicalActivityLevel,
        profile.averageSleepHours,
        profile.exerciseDaysPerWeek,
        profile.preferredWorkoutDays,
        profile.sessionsPerMonth,
      ]

      const filledFields = fields.filter(
        (field) => field !== null && field !== undefined && field !== ''
      ).length

      const totalFields = fields.length
      const completion = Math.round((filledFields / totalFields) * 100)

      return { ...client, profileCompletion: completion }
    })

    return NextResponse.json(
      { clients: clientsWithCompletion },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Get clients error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}
