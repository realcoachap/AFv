import { NextResponse } from 'next/server'
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/app/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { parseAvatarConfig, DEFAULT_CUSTOMIZATION } from '@/app/lib/rpg/customization'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

/**
 * POST /api/rpg/customize
 * Save avatar customization for authenticated user
 */
export async function POST(request: Request) {
  try {
    // Use shared auth helper
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }

    const { userId } = authResult.session.user
    const body = await request.json()
    const customization: Partial<AvatarCustomization> = body

    // Get user's RPG character (must exist)
    const character = await prisma.rPGCharacter.findUnique({
      where: { userId },
    })

    if (!character) {
      return createErrorResponse('RPG character not found. Complete a session first!', 404)
    }

    // Parse existing config and merge with updates
    const currentConfig = parseAvatarConfig(character.avatarConfig)
    const updatedConfig: AvatarCustomization = {
      ...currentConfig,
      ...customization,
    }

    // Update character with new config
    const updated = await prisma.rPGCharacter.update({
      where: { userId },
      data: {
        avatarConfig: updatedConfig,
      },
    })

    return createSuccessResponse({
      customization: parseAvatarConfig(updated.avatarConfig),
    })
  } catch (error) {
    console.error('Customize avatar error:', error)
    return createErrorResponse('Failed to save customization', 500)
  }
}

/**
 * GET /api/rpg/customize
 * Get current avatar customization for authenticated user
 */
export async function GET() {
  try {
    // Use shared auth helper
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }

    const { userId } = authResult.session.user

    const character = await prisma.rPGCharacter.findUnique({
      where: { userId },
      select: {
        level: true,
        avatarConfig: true,
      },
    })

    if (!character) {
      return NextResponse.json({
        customization: DEFAULT_CUSTOMIZATION,
        level: 1,
      })
    }

    return NextResponse.json({
      customization: parseAvatarConfig(character.avatarConfig),
      level: character.level,
    })
  } catch (error) {
    console.error('Get customization error:', error)
    return createErrorResponse('Failed to fetch customization', 500)
  }
}
