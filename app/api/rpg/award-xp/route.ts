import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { awardXP } from '@/app/lib/rpg/xp'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, amount, source, referenceId, note } = await request.json()

    if (!userId || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Missing userId or amount' },
        { status: 400 }
      )
    }

    const result = await awardXP(userId, amount, source || 'admin_manual', referenceId, note)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to award XP' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      oldXP: result.oldXP,
      newXP: result.newXP,
      oldLevel: result.oldLevel,
      newLevel: result.newLevel,
      didLevelUp: result.didLevelUp,
      unlocks: result.unlocks,
    })
  } catch (error) {
    console.error('Error in /api/rpg/award-xp:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
