import { NextResponse } from 'next/server'
import { requireAdmin, createErrorResponse, createSuccessResponse } from '@/app/lib/api-auth'
import { awardXP } from '@/app/lib/rpg/xp'

export async function POST(request: Request) {
  try {
    // Use shared auth helper
    const authResult = await requireAdmin()
    if (!authResult.success) {
      return authResult.response
    }

    const { userId, amount, source, referenceId, note } = await request.json()

    if (!userId || typeof amount !== 'number') {
      return createErrorResponse('Missing userId or amount', 400)
    }

    const result = await awardXP(userId, amount, source || 'admin_manual', referenceId, note)

    if (!result.success) {
      return createErrorResponse(result.error || 'Failed to award XP', 500)
    }

    return createSuccessResponse({
      oldXP: result.oldXP,
      newXP: result.newXP,
      oldLevel: result.oldLevel,
      newLevel: result.newLevel,
      didLevelUp: result.didLevelUp,
      unlocks: result.unlocks,
    })
  } catch (error) {
    console.error('Error in /api/rpg/award-xp:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
