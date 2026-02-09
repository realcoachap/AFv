/**
 * RPG Stats System
 * Handles Strength, Endurance, Discipline stat calculations
 */

import { prisma } from '@/lib/prisma'

export const STAT_CONFIG = {
  MAX_STAT: 100, // Max value for any stat
  
  // Stat gains per activity
  STRENGTH_PER_SESSION: 1,      // +1 Strength per resistance training session
  ENDURANCE_PER_SESSION: 1,     // +1 Endurance per cardio session
  DISCIPLINE_PER_WEEK_STREAK: 2, // +2 Discipline per 7-day streak maintained
  
  // Decay (optional - can add later if clients become inactive)
  DECAY_ENABLED: false,
}

/**
 * Calculate Power Level (combined stat score)
 */
export function calculatePowerLevel(
  strength: number,
  endurance: number,
  discipline: number
): number {
  return Math.floor((strength + endurance + discipline) / 3)
}

/**
 * Increment strength stat
 */
export async function incrementStrength(userId: string, amount = 1) {
  const character = await prisma.rPGCharacter.findUnique({
    where: { userId },
  })

  if (!character) {
    throw new Error('Character not found')
  }

  const newStrength = Math.min(character.strength + amount, STAT_CONFIG.MAX_STAT)

  await prisma.rPGCharacter.update({
    where: { userId },
    data: { strength: newStrength },
  })

  return newStrength
}

/**
 * Increment endurance stat
 */
export async function incrementEndurance(userId: string, amount = 1) {
  const character = await prisma.rPGCharacter.findUnique({
    where: { userId },
  })

  if (!character) {
    throw new Error('Character not found')
  }

  const newEndurance = Math.min(character.endurance + amount, STAT_CONFIG.MAX_STAT)

  await prisma.rPGCharacter.update({
    where: { userId },
    data: { endurance: newEndurance },
  })

  return newEndurance
}

/**
 * Increment discipline stat
 */
export async function incrementDiscipline(userId: string, amount = 2) {
  const character = await prisma.rPGCharacter.findUnique({
    where: { userId },
  })

  if (!character) {
    throw new Error('Character not found')
  }

  const newDiscipline = Math.min(character.discipline + amount, STAT_CONFIG.MAX_STAT)

  await prisma.rPGCharacter.update({
    where: { userId },
    data: { discipline: newDiscipline },
  })

  return newDiscipline
}

/**
 * Get stat-based avatar modifiers
 * Returns visual changes based on stats
 */
export function getStatModifiers(strength: number, endurance: number, discipline: number) {
  return {
    // Strength affects muscle definition
    muscleTier: strength < 25 ? 'normal' : strength < 50 ? 'defined' : strength < 75 ? 'muscular' : 'huge',
    
    // Endurance affects body lean-ness
    leannessTier: endurance < 25 ? 'standard' : endurance < 50 ? 'lean' : endurance < 75 ? 'athletic' : 'shredded',
    
    // Discipline affects aura/glow
    auraTier: discipline < 25 ? 'none' : discipline < 50 ? 'faint' : discipline < 75 ? 'bright' : 'radiant',
    
    // Combined power level
    powerLevel: calculatePowerLevel(strength, endurance, discipline),
  }
}

/**
 * Get stat breakdown with labels
 */
export function getStatLabels(strength: number, endurance: number, discipline: number) {
  const getLabel = (stat: number) => {
    if (stat < 10) return 'Novice'
    if (stat < 25) return 'Beginner'
    if (stat < 50) return 'Intermediate'
    if (stat < 75) return 'Advanced'
    if (stat < 90) return 'Expert'
    return 'Master'
  }

  return {
    strength: getLabel(strength),
    endurance: getLabel(endurance),
    discipline: getLabel(discipline),
  }
}

/**
 * Update stats based on session type
 */
export async function updateStatsForSession(userId: string, sessionType: string) {
  // Map session types to stat gains
  const statGains: { strength?: number; endurance?: number } = {}

  // Determine stat gains based on session type
  const lowerType = sessionType.toLowerCase()
  
  if (
    lowerType.includes('strength') ||
    lowerType.includes('weights') ||
    lowerType.includes('resistance') ||
    lowerType.includes('lifting')
  ) {
    statGains.strength = STAT_CONFIG.STRENGTH_PER_SESSION
  }
  
  if (
    lowerType.includes('cardio') ||
    lowerType.includes('running') ||
    lowerType.includes('endurance') ||
    lowerType.includes('hiit')
  ) {
    statGains.endurance = STAT_CONFIG.ENDURANCE_PER_SESSION
  }

  // Default: assume balanced session (both stats gain half)
  if (!statGains.strength && !statGains.endurance) {
    statGains.strength = 1
    statGains.endurance = 1
  }

  // Apply stat gains
  if (statGains.strength) {
    await incrementStrength(userId, statGains.strength)
  }

  if (statGains.endurance) {
    await incrementEndurance(userId, statGains.endurance)
  }

  return statGains
}
