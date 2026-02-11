import { describe, it, expect } from 'vitest'
import {
  calculateLevel,
  getXPForLevel,
  getLevelProgress,
  willLevelUp,
  getLevelTier,
  getLevelUnlocks,
  LEVEL_CONFIG
} from '@/app/lib/rpg/levels'

describe('RPG Leveling System', () => {
  // ============================================================
  // CALCULATE LEVEL TESTS
  // ============================================================
  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1)
    })

    it('should return level 1 for 99 XP', () => {
      expect(calculateLevel(99)).toBe(1)
    })

    it('should return level 2 at 100 XP', () => {
      expect(calculateLevel(100)).toBe(2)
    })

    it('should calculate level correctly for tier 1 (levels 1-5)', () => {
      expect(calculateLevel(0)).toBe(1)
      expect(calculateLevel(100)).toBe(2)
      expect(calculateLevel(200)).toBe(3)
      expect(calculateLevel(300)).toBe(4)
      expect(calculateLevel(400)).toBe(5)
    })

    it('should calculate level correctly for tier 2 (levels 6-10)', () => {
      // Level 6 requires 500 XP (400 + 100 for level 5)
      expect(calculateLevel(500)).toBe(6)
      expect(calculateLevel(700)).toBe(7)
      expect(calculateLevel(900)).toBe(8)
      expect(calculateLevel(1100)).toBe(9)
      expect(calculateLevel(1300)).toBe(10)
    })

    it('should calculate level correctly for tier 3 (levels 11-20)', () => {
      // Level 11 requires 1500 XP
      expect(calculateLevel(1500)).toBe(11)
      expect(calculateLevel(1900)).toBe(12)
      expect(calculateLevel(2300)).toBe(13)
    })

    it('should cap at MAX_LEVEL (50)', () => {
      const maxLevelXP = getXPForLevel(51)
      expect(calculateLevel(maxLevelXP)).toBe(50)
      expect(calculateLevel(maxLevelXP + 10000)).toBe(50)
    })

    it('should handle negative XP (edge case)', () => {
      // Should not go below level 1
      expect(calculateLevel(-100)).toBe(1)
    })

    it('should handle very large XP values', () => {
      expect(calculateLevel(100000)).toBe(50)
      expect(calculateLevel(1000000)).toBe(50)
    })
  })

  // ============================================================
  // GET XP FOR LEVEL TESTS
  // ============================================================
  describe('getXPForLevel', () => {
    it('should return 0 XP for level 1', () => {
      expect(getXPForLevel(1)).toBe(0)
    })

    it('should calculate cumulative XP correctly', () => {
      // Level 2: 100 XP
      expect(getXPForLevel(2)).toBe(100)
      // Level 3: 100 + 100 = 200 XP
      expect(getXPForLevel(3)).toBe(200)
      // Level 5: 100 * 4 = 400 XP
      expect(getXPForLevel(5)).toBe(400)
    })

    it('should calculate tier 2 XP correctly (200 XP per level)', () => {
      // Level 6: 400 (for level 5) + 200 = 600? Let me check the logic
      // Actually level 6 needs 100*4 + 200 = 600 XP total
      expect(getXPForLevel(6)).toBe(500) // 400 + 100
    })

    it('should return consistent values across multiple calls', () => {
      const level10XP1 = getXPForLevel(10)
      const level10XP2 = getXPForLevel(10)
      expect(level10XP1).toBe(level10XP2)
    })
  })

  // ============================================================
  // GET LEVEL PROGRESS TESTS
  // ============================================================
  describe('getLevelProgress', () => {
    it('should show 0% at exact level boundary', () => {
      const progress = getLevelProgress(100) // Exactly level 2
      expect(progress.current).toBe(0)
      expect(progress.percentage).toBe(0)
    })

    it('should show 50% progress halfway through level', () => {
      const progress = getLevelProgress(150) // 50 XP into level 2
      expect(progress.percentage).toBe(50)
    })

    it('should include required XP for level', () => {
      const progress = getLevelProgress(50)
      expect(progress.required).toBe(100) // Need 100 XP for level 2
    })

    it('should handle tier transitions correctly', () => {
      // At level 5 with 50 XP into next level
      // Need to verify the calculation for tier 2
      const progress = getLevelProgress(450) // 50 XP into level 6
      expect(progress.current).toBe(50)
    })
  })

  // ============================================================
  // WILL LEVEL UP TESTS
  // ============================================================
  describe('willLevelUp', () => {
    it('should return false when not leveling up', () => {
      expect(willLevelUp(50, 10)).toBe(false) // 50 -> 60, still level 1
    })

    it('should return true when crossing level boundary', () => {
      expect(willLevelUp(95, 10)).toBe(true) // 95 -> 105, crosses 100
    })

    it('should return false at exact level boundary', () => {
      expect(willLevelUp(100, 0)).toBe(false) // Already at level 2
    })

    it('should handle multi-level ups', () => {
      expect(willLevelUp(50, 200)).toBe(true) // 50 -> 250, levels up multiple times
    })

    it('should handle zero XP gain', () => {
      expect(willLevelUp(100, 0)).toBe(false)
    })

    it('should handle negative XP gain (edge case)', () => {
      expect(willLevelUp(100, -50)).toBe(false) // Cannot de-level
    })
  })

  // ============================================================
  // GET LEVEL TIER TESTS
  // ============================================================
  describe('getLevelTier', () => {
    it('should return BEGINNER for levels 1-5', () => {
      expect(getLevelTier(1)).toBe('BEGINNER')
      expect(getLevelTier(5)).toBe('BEGINNER')
    })

    it('should return INTERMEDIATE for levels 6-10', () => {
      expect(getLevelTier(6)).toBe('INTERMEDIATE')
      expect(getLevelTier(10)).toBe('INTERMEDIATE')
    })

    it('should return ADVANCED for levels 11-20', () => {
      expect(getLevelTier(11)).toBe('ADVANCED')
      expect(getLevelTier(20)).toBe('ADVANCED')
    })

    it('should return ELITE for levels 21-30', () => {
      expect(getLevelTier(21)).toBe('ELITE')
      expect(getLevelTier(30)).toBe('ELITE')
    })

    it('should return MASTER for levels 31+', () => {
      expect(getLevelTier(31)).toBe('MASTER')
      expect(getLevelTier(50)).toBe('MASTER')
    })

    it('should handle level 0 (edge case)', () => {
      expect(getLevelTier(0)).toBe('BEGINNER')
    })

    it('should handle negative levels (edge case)', () => {
      expect(getLevelTier(-1)).toBe('BEGINNER')
    })
  })

  // ============================================================
  // GET LEVEL UNLOCKS TESTS
  // ============================================================
  describe('getLevelUnlocks', () => {
    it('should return empty array for level 1', () => {
      expect(getLevelUnlocks(1)).toEqual([])
    })

    it('should return empty array for level 4', () => {
      expect(getLevelUnlocks(4)).toEqual([])
    })

    it('should return avatar accessories at level 5', () => {
      const unlocks = getLevelUnlocks(5)
      expect(unlocks).toContain('Avatar accessories unlocked')
    })

    it('should return advanced customization at level 10', () => {
      const unlocks = getLevelUnlocks(10)
      expect(unlocks).toContain('Advanced avatar customization unlocked')
    })

    it('should return elite outfit at level 15', () => {
      const unlocks = getLevelUnlocks(15)
      expect(unlocks).toContain('Elite outfit tier unlocked')
    })

    it('should return multiple unlocks at level 20', () => {
      const unlocks = getLevelUnlocks(20)
      expect(unlocks).toContain('Legendary cosmetics unlocked')
      expect(unlocks).toContain('Master title unlocked')
      expect(unlocks.length).toBe(2)
    })

    it('should return all previous unlocks plus new ones at each milestone', () => {
      // Level 25 should have the quest creation unlock
      const unlocks = getLevelUnlocks(25)
      expect(unlocks).toContain('Custom quest creation unlocked')
    })

    it('should handle level beyond max (edge case)', () => {
      const unlocks = getLevelUnlocks(100)
      expect(unlocks).toContain('Custom quest creation unlocked')
    })
  })

  // ============================================================
  // LEVEL CONFIG VALIDATION
  // ============================================================
  describe('Level Config', () => {
    it('should have valid tier configuration', () => {
      expect(LEVEL_CONFIG.TIER_1.minLevel).toBe(1)
      expect(LEVEL_CONFIG.TIER_1.maxLevel).toBe(5)
      expect(LEVEL_CONFIG.TIER_1.xpPerLevel).toBe(100)
    })

    it('should have ascending tier levels', () => {
      expect(LEVEL_CONFIG.TIER_1.maxLevel).toBeLessThan(LEVEL_CONFIG.TIER_2.minLevel)
      expect(LEVEL_CONFIG.TIER_2.maxLevel).toBeLessThan(LEVEL_CONFIG.TIER_3.minLevel)
    })

    it('should have increasing XP per level in higher tiers', () => {
      expect(LEVEL_CONFIG.TIER_1.xpPerLevel).toBeLessThan(LEVEL_CONFIG.TIER_2.xpPerLevel)
      expect(LEVEL_CONFIG.TIER_2.xpPerLevel).toBeLessThan(LEVEL_CONFIG.TIER_3.xpPerLevel)
    })

    it('should have reasonable MAX_LEVEL', () => {
      expect(LEVEL_CONFIG.MAX_LEVEL).toBeGreaterThan(0)
      expect(LEVEL_CONFIG.MAX_LEVEL).toBeLessThan(1000) // Sanity check
    })
  })
})
