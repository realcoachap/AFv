/**
 * RPG Session Integration
 * Handles automatic XP/stat updates when sessions are completed
 */

import { prisma } from '@/lib/prisma'
import { awardXP, XP_REWARDS, initializeCharacter } from './xp'
import { updateStatsForSession } from './stats'
import { updateStreak } from './streaks'

export type SessionCompletionResult = {
  success: boolean
  xpAwarded: number
  levelUp?: {
    oldLevel: number
    newLevel: number
    unlocks: string[]
  }
  statsUpdated: {
    strength?: number
    endurance?: number
  }
  streakUpdate: {
    currentStreak: number
    longestStreak: number
    bonusAwarded: boolean
    disciplineGained: boolean
  }
  error?: string
}

/**
 * Process RPG updates when a session is completed
 * Call this when session status changes to COMPLETED
 */
export async function onSessionComplete(
  sessionId: string,
  clientId: string,
  focusType?: string,
  workoutType?: string
): Promise<SessionCompletionResult> {
  try {
    // Ensure character exists (auto-initialize if needed)
    let character = await prisma.rPGCharacter.findUnique({
      where: { userId: clientId },
    })

    if (!character) {
      const initResult = await initializeCharacter(clientId)
      if (!initResult.success || !initResult.character) {
        return {
          success: false,
          xpAwarded: 0,
          statsUpdated: {},
          streakUpdate: {
            currentStreak: 0,
            longestStreak: 0,
            bonusAwarded: false,
            disciplineGained: false,
          },
          error: 'Failed to initialize character',
        }
      }
      character = initResult.character
    }

    // 1. Award XP for session completion
    // 100 XP for coached sessions, 75 XP for self-logged
    const xpAmount = workoutType === 'SELF_LOGGED' ? 75 : XP_REWARDS.SESSION_COMPLETE
    const xpResult = await awardXP(
      clientId,
      xpAmount,
      workoutType === 'SELF_LOGGED' ? 'self_logged_workout' : 'session_complete',
      sessionId,
      workoutType === 'SELF_LOGGED' ? 'Self-logged workout' : 'Completed training session'
    )

    if (!xpResult.success) {
      return {
        success: false,
        xpAwarded: 0,
        statsUpdated: {},
        streakUpdate: {
          currentStreak: 0,
          longestStreak: 0,
          bonusAwarded: false,
          disciplineGained: false,
        },
        error: xpResult.error,
      }
    }

    // 2. Update stats based on focus type
    const statsFocus = focusType?.toLowerCase() || 'balanced'
    const statsGained = await updateStatsForSession(
      clientId,
      statsFocus
    )

    // 3. Update streak
    const streakResult = await updateStreak(clientId)

    // 4. Compile result
    const result: SessionCompletionResult = {
      success: true,
      xpAwarded: xpAmount,
      statsUpdated: statsGained,
      streakUpdate: {
        currentStreak: streakResult.currentStreak,
        longestStreak: streakResult.longestStreak,
        bonusAwarded: streakResult.bonusAwarded,
        disciplineGained: streakResult.disciplineGained,
      },
    }

    // 5. Add level up info if applicable
    if (xpResult.didLevelUp) {
      result.levelUp = {
        oldLevel: xpResult.oldLevel!,
        newLevel: xpResult.newLevel!,
        unlocks: xpResult.unlocks || [],
      }
    }

    return result
  } catch (error) {
    console.error('Error in onSessionComplete:', error)
    return {
      success: false,
      xpAwarded: 0,
      statsUpdated: {},
      streakUpdate: {
        currentStreak: 0,
        longestStreak: 0,
        bonusAwarded: false,
        disciplineGained: false,
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Detect session type from appointment data
 * Returns 'strength', 'cardio', or 'balanced'
 */
export function detectSessionType(sessionType?: string, notes?: string): string {
  const lowerType = (sessionType || '').toLowerCase()
  const lowerNotes = (notes || '').toLowerCase()

  // Check session type field
  if (
    lowerType.includes('strength') ||
    lowerType.includes('weights') ||
    lowerType.includes('resistance') ||
    lowerType.includes('lifting')
  ) {
    return 'strength'
  }

  if (
    lowerType.includes('cardio') ||
    lowerType.includes('running') ||
    lowerType.includes('endurance') ||
    lowerType.includes('hiit')
  ) {
    return 'cardio'
  }

  // Check notes for keywords
  if (
    lowerNotes.includes('strength') ||
    lowerNotes.includes('weights') ||
    lowerNotes.includes('bench') ||
    lowerNotes.includes('squat') ||
    lowerNotes.includes('deadlift')
  ) {
    return 'strength'
  }

  if (
    lowerNotes.includes('cardio') ||
    lowerNotes.includes('running') ||
    lowerNotes.includes('treadmill') ||
    lowerNotes.includes('bike') ||
    lowerNotes.includes('elliptical')
  ) {
    return 'cardio'
  }

  // Default: balanced (both stats gain)
  return 'balanced'
}
