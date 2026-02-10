/**
 * RPG Streak System
 * Handles daily workout streak tracking and bonuses
 */

import { prisma } from '@/lib/prisma'
import { awardXP, XP_REWARDS } from './xp'
import { incrementDiscipline } from './stats'

/**
 * Update user's workout streak after completing a session
 */
export async function updateStreak(userId: string) {
  const character = await prisma.rPGCharacter.findUnique({
    where: { userId },
  })

  if (!character) {
    throw new Error('Character not found')
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastWorkout = character.lastWorkoutDate
    ? new Date(
        character.lastWorkoutDate.getFullYear(),
        character.lastWorkoutDate.getMonth(),
        character.lastWorkoutDate.getDate()
      )
    : null

  let newStreak = character.currentStreak
  let streakBonusAwarded = false
  let disciplineGained = false

  if (!lastWorkout) {
    // First workout ever
    newStreak = 1
  } else {
    const daysDiff = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 0) {
      // Same day - no streak change
      return {
        streakUpdated: false,
        currentStreak: character.currentStreak,
        bonusAwarded: false,
      }
    } else if (daysDiff === 1) {
      // Next day - streak continues!
      newStreak = character.currentStreak + 1

      // Award streak bonuses
      if (newStreak === 7) {
        await awardXP(userId, XP_REWARDS.STREAK_7_DAYS, 'streak_bonus', undefined, '7-day streak!')
        streakBonusAwarded = true
      } else if (newStreak === 30) {
        await awardXP(userId, XP_REWARDS.STREAK_30_DAYS, 'streak_bonus', undefined, '30-day streak!')
        streakBonusAwarded = true
      } else if (newStreak === 90) {
        await awardXP(userId, XP_REWARDS.STREAK_90_DAYS, 'streak_bonus', undefined, '90-day streak!')
        streakBonusAwarded = true
      }

      // Award discipline every 7 days
      if (newStreak % 7 === 0) {
        await incrementDiscipline(userId, 2)
        disciplineGained = true
      }
    } else {
      // Missed a day - streak broken
      newStreak = 1
    }
  }

  // Update character
  const updatedCharacter = await prisma.rPGCharacter.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak:
        newStreak > character.longestStreak ? newStreak : character.longestStreak,
      lastWorkoutDate: now,
    },
  })

  return {
    streakUpdated: true,
    currentStreak: newStreak,
    longestStreak: updatedCharacter.longestStreak,
    streakBroken: lastWorkout ? Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)) > 1 : false,
    bonusAwarded: streakBonusAwarded,
    disciplineGained,
  }
}

/**
 * Get streak status for a user (for notifications, etc.)
 */
export async function getStreakStatus(userId: string) {
  const character = await prisma.rPGCharacter.findUnique({
    where: { userId },
  })

  if (!character) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
      isAtRisk: false,
      daysUntilBreak: 0,
    }
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastWorkout = character.lastWorkoutDate
    ? new Date(
        character.lastWorkoutDate.getFullYear(),
        character.lastWorkoutDate.getMonth(),
        character.lastWorkoutDate.getDate()
      )
    : null

  let isAtRisk = false
  let daysUntilBreak = 0

  if (lastWorkout) {
    const daysDiff = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24))
    isAtRisk = daysDiff === 1 // At risk if last workout was yesterday
    daysUntilBreak = isAtRisk ? 1 : 0
  }

  return {
    currentStreak: character.currentStreak,
    longestStreak: character.longestStreak,
    lastWorkoutDate: character.lastWorkoutDate,
    isAtRisk,
    daysUntilBreak,
  }
}
