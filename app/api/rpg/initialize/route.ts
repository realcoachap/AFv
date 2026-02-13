import { NextResponse } from 'next/server'
import { requireAdmin, createErrorResponse, createSuccessResponse } from '@/app/lib/api-auth'
import { initializeCharacter } from '@/app/lib/rpg/xp'

export async function POST(request: Request) {
  try {
    // Use shared auth helper
    const authResult = await requireAdmin()
    if (!authResult.success) {
      return authResult.response
    }

    const { userId } = await request.json()

    if (!userId) {
      return createErrorResponse('Missing userId', 400)
    }

    const result = await initializeCharacter(userId)

    if (!result.success) {
      return createErrorResponse(result.error || 'Failed to initialize character', 500)
    }

    return createSuccessResponse({ character: result.character })
  } catch (error) {
    console.error('Error in /api/rpg/initialize:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
