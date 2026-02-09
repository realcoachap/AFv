/**
 * RPG Leveling System
 * Handles level calculations, XP requirements, and progression
 */

export const LEVEL_CONFIG = {
  // XP required per level tier
  TIER_1: { minLevel: 1, maxLevel: 5, xpPerLevel: 100 },
  TIER_2: { minLevel: 6, maxLevel: 10, xpPerLevel: 200 },
  TIER_3: { minLevel: 11, maxLevel: 20, xpPerLevel: 400 },
  TIER_4: { minLevel: 21, maxLevel: 30, xpPerLevel: 600 },
  TIER_5: { minLevel: 31, maxLevel: 50, xpPerLevel: 800 },
  MAX_LEVEL: 50,
}

/**
 * Calculate XP required for a specific level
 */
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0

  let totalXP = 0

  // Calculate cumulative XP for all previous levels
  for (let i = 1; i < level; i++) {
    if (i <= LEVEL_CONFIG.TIER_1.maxLevel) {
      totalXP += LEVEL_CONFIG.TIER_1.xpPerLevel
    } else if (i <= LEVEL_CONFIG.TIER_2.maxLevel) {
      totalXP += LEVEL_CONFIG.TIER_2.xpPerLevel
    } else if (i <= LEVEL_CONFIG.TIER_3.maxLevel) {
      totalXP += LEVEL_CONFIG.TIER_3.xpPerLevel
    } else if (i <= LEVEL_CONFIG.TIER_4.maxLevel) {
      totalXP += LEVEL_CONFIG.TIER_4.xpPerLevel
    } else {
      totalXP += LEVEL_CONFIG.TIER_5.xpPerLevel
    }
  }

  return totalXP
}

/**
 * Calculate current level based on total XP
 */
export function calculateLevel(xp: number): number {
  let level = 1

  while (level < LEVEL_CONFIG.MAX_LEVEL && xp >= getXPForLevel(level + 1)) {
    level++
  }

  return level
}

/**
 * Get XP progress within current level
 * Returns { current: number, required: number, percentage: number }
 */
export function getLevelProgress(xp: number) {
  const currentLevel = calculateLevel(xp)
  const currentLevelXP = getXPForLevel(currentLevel)
  const nextLevelXP = getXPForLevel(currentLevel + 1)

  const xpIntoLevel = xp - currentLevelXP
  const xpRequiredForLevel = nextLevelXP - currentLevelXP

  return {
    current: xpIntoLevel,
    required: xpRequiredForLevel,
    percentage: Math.floor((xpIntoLevel / xpRequiredForLevel) * 100),
  }
}

/**
 * Check if adding XP will trigger a level up
 */
export function willLevelUp(currentXP: number, xpToAdd: number): boolean {
  const currentLevel = calculateLevel(currentXP)
  const newLevel = calculateLevel(currentXP + xpToAdd)
  return newLevel > currentLevel
}

/**
 * Get level tier name (for cosmetic unlocks)
 */
export function getLevelTier(level: number): string {
  if (level >= 31) return 'MASTER'
  if (level >= 21) return 'ELITE'
  if (level >= 11) return 'ADVANCED'
  if (level >= 6) return 'INTERMEDIATE'
  return 'BEGINNER'
}

/**
 * Get level rewards/unlocks
 */
export function getLevelUnlocks(level: number) {
  const unlocks: string[] = []

  // Milestone unlocks
  if (level === 5) unlocks.push('Avatar accessories unlocked')
  if (level === 10) unlocks.push('Advanced avatar customization unlocked')
  if (level === 15) unlocks.push('Elite outfit tier unlocked')
  if (level === 20) unlocks.push('Legendary cosmetics unlocked', 'Master title unlocked')
  if (level === 25) unlocks.push('Custom quest creation unlocked')

  return unlocks
}
