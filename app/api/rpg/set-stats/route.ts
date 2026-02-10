import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * Manually set a character's stats (admin only, for testing)
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, strength, endurance, discipline } = await request.json()

    if (!userId || strength === undefined || endurance === undefined || discipline === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Clamp values between 0-100
    const clampedStrength = Math.max(0, Math.min(100, strength))
    const clampedEndurance = Math.max(0, Math.min(100, endurance))
    const clampedDiscipline = Math.max(0, Math.min(100, discipline))

    const character = await prisma.rPGCharacter.update({
      where: { userId },
      data: {
        strength: clampedStrength,
        endurance: clampedEndurance,
        discipline: clampedDiscipline,
      },
    })

    return NextResponse.json({
      success: true,
      character,
    })
  } catch (error) {
    console.error('Error in /api/rpg/set-stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
