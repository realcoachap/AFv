import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { parseAvatarConfig, DEFAULT_CUSTOMIZATION } from '@/app/lib/rpg/customization'
import type { AvatarCustomization } from '@/app/lib/rpg/customization'

/**
 * POST /api/rpg/customize
 * Save avatar customization for authenticated user
 */
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const customization: Partial<AvatarCustomization> = body

    // Get user's RPG character (must exist)
    const character = await prisma.rPGCharacter.findUnique({
      where: { userId: session.user.id },
    })

    if (!character) {
      return NextResponse.json(
        { error: 'RPG character not found. Complete a session first!' },
        { status: 404 }
      )
    }

    // Parse existing config and merge with updates
    const currentConfig = parseAvatarConfig(character.avatarConfig)
    const updatedConfig: AvatarCustomization = {
      ...currentConfig,
      ...customization,
    }

    // Update character with new config
    const updated = await prisma.rPGCharacter.update({
      where: { userId: session.user.id },
      data: {
        avatarConfig: updatedConfig,
      },
    })

    return NextResponse.json({
      success: true,
      customization: parseAvatarConfig(updated.avatarConfig),
    })
  } catch (error) {
    console.error('Customize avatar error:', error)
    return NextResponse.json(
      { error: 'Failed to save customization' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/rpg/customize
 * Get current avatar customization for authenticated user
 */
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const character = await prisma.rPGCharacter.findUnique({
      where: { userId: session.user.id },
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
    return NextResponse.json(
      { error: 'Failed to fetch customization' },
      { status: 500 }
    )
  }
}
