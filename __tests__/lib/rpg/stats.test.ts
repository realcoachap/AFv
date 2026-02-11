import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  calculatePowerLevel,
  incrementStrength,
  incrementEndurance,
  incrementDiscipline,
  getStatModifiers,
  getStatLabels,
  updateStatsForSession,
  STAT_CONFIG
} from '@/app/lib/rpg/stats'
import { prisma } from '@/lib/prisma'

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    rPGCharacter: {
      findUnique: vi.fn(),
      update: vi.fn()
    }
  }
}))

describe('RPG Stats System', () => {
  const mockCharacter = {
    id: 'char-123',
    userId: 'user-123',
    strength: 10,
    endurance: 15,
    discipline: 5
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================================
  // CALCULATE POWER LEVEL TESTS
  // ============================================================
  describe('calculatePowerLevel', () => {
    it('should calculate average of all three stats', () => {
      expect(calculatePowerLevel(30, 30, 30)).toBe(30)
    })

    it('should floor the result', () => {
      expect(calculatePowerLevel(31, 31, 31)).toBe(31) // 31, floored
    })

    it('should handle zero stats', () => {
      expect(calculatePowerLevel(0, 0, 0)).toBe(0)
    })

    it('should handle max stats', () => {
      expect(calculatePowerLevel(100, 100, 100)).toBe(100)
    })

    it('should handle uneven stats', () => {
      // (10 + 20 + 30) / 3 = 20
      expect(calculatePowerLevel(10, 20, 30)).toBe(20)
    })

    it('should handle single max stat', () => {
      // (100 + 0 + 0) / 3 = 33.33... floored to 33
      expect(calculatePowerLevel(100, 0, 0)).toBe(33)
    })

    it('should handle negative stats (edge case)', () => {
      // (-10 + 0 + 0) / 3 = -3.33... floored to -4
      expect(calculatePowerLevel(-10, 0, 0)).toBe(-4)
    })
  })

  // ============================================================
  // INCREMENT STRENGTH TESTS
  // ============================================================
  describe('incrementStrength', () => {
    it('should increment strength by default amount (1)', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue(mockCharacter as any)
      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({ ...mockCharacter, strength: 11 } as any)

      const result = await incrementStrength('user-123')
      expect(result).toBe(11)
      expect(prisma.rPGCharacter.update).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        data: { strength: 11 }
      })
    })

    it('should increment strength by custom amount', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue(mockCharacter as any)
      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({ ...mockCharacter, strength: 15 } as any)

      const result = await incrementStrength('user-123', 5)
      expect(result).toBe(15)
    })

    it('should cap strength at MAX_STAT (100)', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        ...mockCharacter,
        strength: 98
      } as any)
      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        ...mockCharacter,
        strength: 100
      } as any)

      const result = await incrementStrength('user-123', 5)
      expect(result).toBe(100)
    })

    it('should throw error if character not found', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue(null)

      await expect(incrementStrength('nonexistent-user')).rejects.toThrow('Character not found')
    })

    it('should not exceed MAX_STAT even with large increment', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        ...mockCharacter,
        strength: 50
      } as any)
      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        ...mockCharacter,
        strength: 100
      } as any)

      const result = await incrementStrength('user-123', 100)
      expect(result).toBe(100)
    })
  })

  // ============================================================
  // INCREMENT ENDURANCE TESTS
  // ============================================================
  describe('incrementEndurance', () => {
    it('should increment endurance by default amount (1)', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue(mockCharacter as any)
      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({ ...mockCharacter, endurance: 16 } as any)

      const result = await incrementEndurance('user-123')
      expect(result).toBe(16)
    })

    it('should cap endurance at MAX_STAT (100)', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        ...mockCharacter,
        endurance: 99
      } as any)
      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        ...mockCharacter,
        endurance: 100
      } as any)

      const result = await incrementEndurance('user-123', 5)
      expect(result).toBe(100)
    })

    it('should throw error if character not found', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue(null)

      await expect(incrementEndurance('nonexistent-user')).rejects.toThrow('Character not found')
    })
  })

  // ============================================================
  // INCREMENT DISCIPLINE TESTS
  // ============================================================
  describe('incrementDiscipline', () => {
    it('should increment discipline by default amount (2)', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue(mockCharacter as any)
      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({ ...mockCharacter, discipline: 7 } as any)

      const result = await incrementDiscipline('user-123')
      expect(result).toBe(7)
    })

    it('should accept custom amount', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue(mockCharacter as any)
      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({ ...mockCharacter, discipline: 10 } as any)

      const result = await incrementDiscipline('user-123', 5)
      expect(result).toBe(10)
    })

    it('should cap discipline at MAX_STAT (100)', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        ...mockCharacter,
        discipline: 99
      } as any)
      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        ...mockCharacter,
        discipline: 100
      } as any)

      const result = await incrementDiscipline('user-123', 5)
      expect(result).toBe(100)
    })

    it('should throw error if character not found', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue(null)

      await expect(incrementDiscipline('nonexistent-user')).rejects.toThrow('Character not found')
    })
  })

  // ============================================================
  // GET STAT MODIFIERS TESTS
  // ============================================================
  describe('getStatModifiers', () => {
    it('should return lowest tier for stats < 25', () => {
      const modifiers = getStatModifiers(10, 10, 10)
      expect(modifiers.muscleTier).toBe('normal')
      expect(modifiers.leannessTier).toBe('standard')
      expect(modifiers.auraTier).toBe('none')
    })

    it('should return second tier for stats 25-49', () => {
      const modifiers = getStatModifiers(30, 30, 30)
      expect(modifiers.muscleTier).toBe('defined')
      expect(modifiers.leannessTier).toBe('lean')
      expect(modifiers.auraTier).toBe('faint')
    })

    it('should return third tier for stats 50-74', () => {
      const modifiers = getStatModifiers(60, 60, 60)
      expect(modifiers.muscleTier).toBe('muscular')
      expect(modifiers.leannessTier).toBe('athletic')
      expect(modifiers.auraTier).toBe('bright')
    })

    it('should return highest tier for stats >= 75', () => {
      const modifiers = getStatModifiers(80, 80, 80)
      expect(modifiers.muscleTier).toBe('huge')
      expect(modifiers.leannessTier).toBe('shredded')
      expect(modifiers.auraTier).toBe('radiant')
    })

    it('should calculate power level correctly', () => {
      const modifiers = getStatModifiers(30, 60, 90)
      expect(modifiers.powerLevel).toBe(60) // (30+60+90)/3
    })

    it('should handle boundary values correctly', () => {
      const modifiers = getStatModifiers(24, 49, 74)
      expect(modifiers.muscleTier).toBe('normal')
      expect(modifiers.leannessTier).toBe('lean')
      expect(modifiers.auraTier).toBe('bright')
    })

    it('should handle max stats', () => {
      const modifiers = getStatModifiers(100, 100, 100)
      expect(modifiers.muscleTier).toBe('huge')
      expect(modifiers.leannessTier).toBe('shredded')
      expect(modifiers.auraTier).toBe('radiant')
      expect(modifiers.powerLevel).toBe(100)
    })

    it('should handle zero stats', () => {
      const modifiers = getStatModifiers(0, 0, 0)
      expect(modifiers.muscleTier).toBe('normal')
      expect(modifiers.leannessTier).toBe('standard')
      expect(modifiers.auraTier).toBe('none')
      expect(modifiers.powerLevel).toBe(0)
    })
  })

  // ============================================================
  // GET STAT LABELS TESTS
  // ============================================================
  describe('getStatLabels', () => {
    it('should return Novice for stats < 10', () => {
      const labels = getStatLabels(5, 5, 5)
      expect(labels.strength).toBe('Novice')
      expect(labels.endurance).toBe('Novice')
      expect(labels.discipline).toBe('Novice')
    })

    it('should return Beginner for stats 10-24', () => {
      const labels = getStatLabels(15, 20, 24)
      expect(labels.strength).toBe('Beginner')
      expect(labels.endurance).toBe('Beginner')
      expect(labels.discipline).toBe('Beginner')
    })

    it('should return Intermediate for stats 25-49', () => {
      const labels = getStatLabels(30, 40, 49)
      expect(labels.strength).toBe('Intermediate')
      expect(labels.endurance).toBe('Intermediate')
      expect(labels.discipline).toBe('Intermediate')
    })

    it('should return Advanced for stats 50-74', () => {
      const labels = getStatLabels(50, 60, 74)
      expect(labels.strength).toBe('Advanced')
      expect(labels.endurance).toBe('Advanced')
      expect(labels.discipline).toBe('Advanced')
    })

    it('should return Expert for stats 75-89', () => {
      const labels = getStatLabels(75, 80, 89)
      expect(labels.strength).toBe('Expert')
      expect(labels.endurance).toBe('Expert')
      expect(labels.discipline).toBe('Expert')
    })

    it('should return Master for stats >= 90', () => {
      const labels = getStatLabels(90, 95, 100)
      expect(labels.strength).toBe('Master')
      expect(labels.endurance).toBe('Master')
      expect(labels.discipline).toBe('Master')
    })

    it('should handle mixed stat levels', () => {
      const labels = getStatLabels(5, 30, 80)
      expect(labels.strength).toBe('Novice')
      expect(labels.endurance).toBe('Intermediate')
      expect(labels.discipline).toBe('Expert')
    })

    it('should handle boundary values', () => {
      const labels = getStatLabels(9, 24, 49)
      expect(labels.strength).toBe('Novice')
      expect(labels.endurance).toBe('Beginner')
      expect(labels.discipline).toBe('Intermediate')
    })
  })

  // ============================================================
  // UPDATE STATS FOR SESSION TESTS
  // ============================================================
  describe('updateStatsForSession', () => {
    beforeEach(() => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue(mockCharacter as any)
      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue(mockCharacter as any)
    })

    it('should increase strength for STRENGTH focus', async () => {
      const result = await updateStatsForSession('user-123', 'STRENGTH')
      expect(result.strength).toBe(1)
      expect(result.endurance).toBeUndefined()
    })

    it('should increase endurance for CARDIO focus', async () => {
      const result = await updateStatsForSession('user-123', 'CARDIO')
      expect(result.endurance).toBe(1)
      expect(result.strength).toBeUndefined()
    })

    it('should increase both stats for BALANCED focus', async () => {
      const result = await updateStatsForSession('user-123', 'BALANCED')
      expect(result.strength).toBe(1)
      expect(result.endurance).toBe(1)
    })

    it('should handle lowercase focus types', async () => {
      const result = await updateStatsForSession('user-123', 'strength')
      expect(result.strength).toBe(1)
    })

    it('should handle mixed case focus types', async () => {
      const result = await updateStatsForSession('user-123', 'Cardio')
      expect(result.endurance).toBe(1)
    })

    it('should default to BALANCED for unknown focus types', async () => {
      const result = await updateStatsForSession('user-123', 'UNKNOWN')
      expect(result.strength).toBe(1)
      expect(result.endurance).toBe(1)
    })

    it('should handle keyword detection for strength', async () => {
      const result = await updateStatsForSession('user-123', 'weights')
      expect(result.strength).toBe(1)
    })

    it('should handle keyword detection for cardio', async () => {
      const result = await updateStatsForSession('user-123', 'running')
      expect(result.endurance).toBe(1)
    })

    it('should handle empty string as balanced', async () => {
      const result = await updateStatsForSession('user-123', '')
      expect(result.strength).toBe(1)
      expect(result.endurance).toBe(1)
    })

    it('should handle null focus type as balanced', async () => {
      const result = await updateStatsForSession('user-123', null as any)
      expect(result.strength).toBe(1)
      expect(result.endurance).toBe(1)
    })
  })

  // ============================================================
  // STAT CONFIG VALIDATION
  // ============================================================
  describe('STAT_CONFIG', () => {
    it('should have valid MAX_STAT', () => {
      expect(STAT_CONFIG.MAX_STAT).toBe(100)
    })

    it('should have positive stat gains', () => {
      expect(STAT_CONFIG.STRENGTH_PER_SESSION).toBeGreaterThan(0)
      expect(STAT_CONFIG.ENDURANCE_PER_SESSION).toBeGreaterThan(0)
      expect(STAT_CONFIG.DISCIPLINE_PER_WEEK_STREAK).toBeGreaterThan(0)
    })

    it('should have reasonable stat gain values', () => {
      expect(STAT_CONFIG.STRENGTH_PER_SESSION).toBeLessThanOrEqual(10)
      expect(STAT_CONFIG.ENDURANCE_PER_SESSION).toBeLessThanOrEqual(10)
    })

    it('should have decay disabled by default', () => {
      expect(STAT_CONFIG.DECAY_ENABLED).toBe(false)
    })
  })
})
