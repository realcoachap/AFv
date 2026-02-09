import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { initializeCharacter } from '@/app/lib/rpg/xp'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const result = await initializeCharacter(userId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to initialize character' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, character: result.character })
  } catch (error) {
    console.error('Error in /api/rpg/initialize:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
