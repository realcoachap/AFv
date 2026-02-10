/**
 * RPG XP System
 * Handles XP rewards, transactions, and stat updates
 */

import { prisma } from '@/lib/prisma'
import { calculateLevel, willLevelUp, getLevelUnlocks } from './levels'

export const XP_REWARDS = {
  // Session completion
  SESSION_COMPLETE: 100,
  SESSION_COMPLETE_UNSCHEDULED: 75, // Self-reported workout (lower reward)

  // Quests
  DAILY_QUEST: 50,
  WEEKLY_QUEST: 200,
  MONTHLY_QUEST: 1000,

  // Milestones
  NEW_PR: 50, // Personal record bonus
  STREAK_7_DAYS: 150,
  STREAK_30_DAYS: 500,
  STREAK_90_DAYS: 1500,

  // Social
  REFERRAL: 500, // Friend signs up
}

/**
 * Award XP to a user
 * Handles level ups, stat updates, and transaction logging
 */
export async function awardXP(
  userId: string,
  amount: number,
  source: string,
  referenceId?: string,
  note?: string
) {
  try {
    // Get current character
    const character = await prisma.rPGCharacter.findUnique({
      where: { userId },
    })

    if (!character) {
      throw new Error('RPG character not found')
    }

    const oldXP = character.xp
    const newXP = oldXP + amount
    const oldLevel = character.level
    const newLevel = calculateLevel(newXP)

    const didLevelUp = newLevel > oldLevel

    // Update character
    await prisma.rPGCharacter.update({
      where: { userId },
      data: {
        xp: newXP,
        level: newLevel,
      },
    })

    // Log transaction
    await prisma.rPGXPLog.create({
      data: {
        userId,
        amount,
        source,
        referenceId,
        note,
      },
    })

    // Return level up data if applicable
    return {
      success: true,
      oldXP,
      newXP,
      oldLevel,
      newLevel,
      didLevelUp,
      unlocks: didLevelUp ? getLevelUnlocks(newLevel) : [],
    }
  } catch (error) {
    console.error('Error awarding XP:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Initialize RPG character for new user
 */
export async function initializeCharacter(userId: string) {
  try {
    // Check if character already exists
    const existing = await prisma.rPGCharacter.findUnique({
      where: { userId },
    })

    if (existing) {
      return { success: true, character: existing }
    }

    // Create new character with starter XP (endowed progress effect)
    const character = await prisma.rPGCharacter.create({
      data: {
        userId,
        level: 1,
        xp: 0, // Start at 0 XP
        strength: 0,
        endurance: 0,
        discipline: 0, // Start at 0, grow with streaks
        currentStreak: 0,
        longestStreak: 0,
        avatarConfig: {
          bodyType: 'athletic',
          skinTone: 'medium',
          outfit: 'default',
          colorScheme: 'navy',
        },
        publicProfile: false,
      },
    })

    // No initial XP - start from zero

    return { success: true, character }
  } catch (error) {
    console.error('Error initializing character:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get user's XP history
 */
export async function getXPHistory(userId: string, limit = 50) {
  return await prisma.rPGXPLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

/**
 * Get total XP earned from specific source
 */
export async function getXPBySource(userId: string, source: string) {
  const logs = await prisma.rPGXPLog.findMany({
    where: { userId, source },
  })

  return logs.reduce((total, log) => total + log.amount, 0)
}
