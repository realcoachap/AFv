import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateStreak, getStreakStatus } from '@/app/lib/rpg/streaks'
import { prisma } from '@/lib/prisma'
import { awardXP } from '@/app/lib/rpg/xp'
import { incrementDiscipline } from '@/app/lib/rpg/stats'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    rPGCharacter: {
      findUnique: vi.fn(),
      update: vi.fn()
    }
  }
}))

vi.mock('@/app/lib/rpg/xp', () => ({
  awardXP: vi.fn(),
  XP_REWARDS: {
    STREAK_7_DAYS: 150,
    STREAK_30_DAYS: 500,
    STREAK_90_DAYS: 1500
  }
}))

vi.mock('@/app/lib/rpg/stats', () => ({
  incrementDiscipline: vi.fn()
}))

describe('RPG Streak System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset date to a known value for consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ============================================================
  // FIRST WORKOUT TESTS
  // ============================================================
  describe('First Workout', () => {
    it('should set streak to 1 for first workout ever', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 0,
        longestStreak: 0,
        lastWorkoutDate: null
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 1,
        longestStreak: 1,
        lastWorkoutDate: new Date('2024-01-15T12:00:00Z')
      } as any)

      const result = await updateStreak('user-123')

      expect(result.currentStreak).toBe(1)
      expect(result.longestStreak).toBe(1)
      expect(result.streakBroken).toBe(false)
    })

    it('should update lastWorkoutDate for first workout', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 0,
        longestStreak: 0,
        lastWorkoutDate: null
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({} as any)

      await updateStreak('user-123')

      expect(prisma.rPGCharacter.update).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        data: expect.objectContaining({
          currentStreak: 1,
          longestStreak: 1,
          lastWorkoutDate: expect.any(Date)
        })
      })
    })
  })

  // ============================================================
  // STREAK CONTINUATION TESTS
  // ============================================================
  describe('Streak Continuation', () => {
    it('should increment streak when working out next day', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 3,
        longestStreak: 5,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z') // Yesterday
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 4,
        longestStreak: 5
      } as any)

      const result = await updateStreak('user-123')

      expect(result.currentStreak).toBe(4)
      expect(result.streakUpdated).toBe(true)
      expect(result.streakBroken).toBe(false)
    })

    it('should update longest streak when current exceeds it', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 5,
        longestStreak: 5,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z')
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 6,
        longestStreak: 6
      } as any)

      const result = await updateStreak('user-123')

      expect(result.longestStreak).toBe(6)
    })

    it('should keep longest streak unchanged when not exceeded', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 3,
        longestStreak: 10,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z')
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 4,
        longestStreak: 10
      } as any)

      const result = await updateStreak('user-123')

      expect(result.longestStreak).toBe(10)
    })
  })

  // ============================================================
  // SAME DAY WORKOUT TESTS
  // ============================================================
  describe('Same Day Workout', () => {
    it('should not change streak for multiple workouts same day', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 5,
        longestStreak: 5,
        lastWorkoutDate: new Date('2024-01-15T08:00:00Z') // Same day, earlier
      } as any)

      const result = await updateStreak('user-123')

      expect(result.streakUpdated).toBe(false)
      expect(result.currentStreak).toBe(5)
    })

    it('should not update database for same day workout', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 5,
        longestStreak: 5,
        lastWorkoutDate: new Date('2024-01-15T08:00:00Z')
      } as any)

      await updateStreak('user-123')

      expect(prisma.rPGCharacter.update).not.toHaveBeenCalled()
    })
  })

  // ============================================================
  // STREAK BREAK TESTS
  // ============================================================
  describe('Streak Break', () => {
    it('should reset streak to 1 after missing a day', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 10,
        longestStreak: 10,
        lastWorkoutDate: new Date('2024-01-13T10:00:00Z') // 2 days ago
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 1,
        longestStreak: 10
      } as any)

      const result = await updateStreak('user-123')

      expect(result.currentStreak).toBe(1)
      expect(result.longestStreak).toBe(10) // Keep the record
      expect(result.streakBroken).toBe(true)
    })

    it('should reset streak after missing multiple days', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 20,
        longestStreak: 20,
        lastWorkoutDate: new Date('2024-01-10T10:00:00Z') // 5 days ago
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 1,
        longestStreak: 20
      } as any)

      const result = await updateStreak('user-123')

      expect(result.currentStreak).toBe(1)
      expect(result.streakBroken).toBe(true)
    })
  })

  // ============================================================
  // STREAK BONUS TESTS
  // ============================================================
  describe('Streak Bonuses', () => {
    it('should award 150 XP for 7-day streak', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 6,
        longestStreak: 6,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z')
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 7,
        longestStreak: 7
      } as any)

      const result = await updateStreak('user-123')

      expect(result.bonusAwarded).toBe(true)
      expect(awardXP).toHaveBeenCalledWith(
        'user-123',
        150,
        'streak_bonus',
        undefined,
        '7-day streak!'
      )
    })

    it('should award 500 XP for 30-day streak', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 29,
        longestStreak: 29,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z')
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 30,
        longestStreak: 30
      } as any)

      const result = await updateStreak('user-123')

      expect(result.bonusAwarded).toBe(true)
      expect(awardXP).toHaveBeenCalledWith(
        'user-123',
        500,
        'streak_bonus',
        undefined,
        '30-day streak!'
      )
    })

    it('should award 1500 XP for 90-day streak', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 89,
        longestStreak: 89,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z')
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 90,
        longestStreak: 90
      } as any)

      const result = await updateStreak('user-123')

      expect(result.bonusAwarded).toBe(true)
      expect(awardXP).toHaveBeenCalledWith(
        'user-123',
        1500,
        'streak_bonus',
        undefined,
        '90-day streak!'
      )
    })

    it('should not award bonus for non-milestone streaks', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 5,
        longestStreak: 5,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z')
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 6,
        longestStreak: 6
      } as any)

      const result = await updateStreak('user-123')

      expect(result.bonusAwarded).toBe(false)
      expect(awardXP).not.toHaveBeenCalled()
    })
  })

  // ============================================================
  // DISCIPLINE GAIN TESTS
  // ============================================================
  describe('Discipline Gains', () => {
    it('should award discipline every 7 days', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 6,
        longestStreak: 6,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z')
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 7,
        longestStreak: 7
      } as any)

      const result = await updateStreak('user-123')

      expect(result.disciplineGained).toBe(true)
      expect(incrementDiscipline).toHaveBeenCalledWith('user-123', 2)
    })

    it('should award discipline at 14 days', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 13,
        longestStreak: 13,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z')
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 14,
        longestStreak: 14
      } as any)

      const result = await updateStreak('user-123')

      expect(result.disciplineGained).toBe(true)
    })

    it('should not award discipline on non-week boundaries', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 8,
        longestStreak: 8,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z')
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockResolvedValue({
        currentStreak: 9,
        longestStreak: 9
      } as any)

      const result = await updateStreak('user-123')

      expect(result.disciplineGained).toBe(false)
      expect(incrementDiscipline).not.toHaveBeenCalled()
    })
  })

  // ============================================================
  // ERROR HANDLING TESTS
  // ============================================================
  describe('Error Handling', () => {
    it('should throw error if character not found', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue(null)

      await expect(updateStreak('nonexistent-user')).rejects.toThrow('Character not found')
    })

    it('should handle database update errors', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 1,
        longestStreak: 1,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z')
      } as any)

      vi.mocked(prisma.rPGCharacter.update).mockRejectedValue(new Error('DB error'))

      await expect(updateStreak('user-123')).rejects.toThrow('DB error')
    })
  })

  // ============================================================
  // GET STREAK STATUS TESTS
  // ============================================================
  describe('getStreakStatus', () => {
    it('should return zero streak for new user', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue(null)

      const status = await getStreakStatus('new-user')

      expect(status.currentStreak).toBe(0)
      expect(status.longestStreak).toBe(0)
      expect(status.lastWorkoutDate).toBeNull()
    })

    it('should return at-risk status when last workout was yesterday', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 5,
        longestStreak: 10,
        lastWorkoutDate: new Date('2024-01-14T10:00:00Z') // Yesterday
      } as any)

      const status = await getStreakStatus('user-123')

      expect(status.isAtRisk).toBe(true)
      expect(status.daysUntilBreak).toBe(1)
    })

    it('should return not at-risk when worked out today', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 5,
        longestStreak: 10,
        lastWorkoutDate: new Date('2024-01-15T08:00:00Z') // Today
      } as any)

      const status = await getStreakStatus('user-123')

      expect(status.isAtRisk).toBe(false)
      expect(status.daysUntilBreak).toBe(0)
    })

    it('should return not at-risk when streak is already broken', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 5,
        longestStreak: 10,
        lastWorkoutDate: new Date('2024-01-10T10:00:00Z') // 5 days ago
      } as any)

      const status = await getStreakStatus('user-123')

      expect(status.isAtRisk).toBe(false)
      expect(status.daysUntilBreak).toBe(0)
    })

    it('should return current and longest streak values', async () => {
      vi.mocked(prisma.rPGCharacter.findUnique).mockResolvedValue({
        id: 'char-123',
        userId: 'user-123',
        currentStreak: 15,
        longestStreak: 20,
        lastWorkoutDate: new Date('2024-01-15T08:00:00Z')
      } as any)

      const status = await getStreakStatus('user-123')

      expect(status.currentStreak).toBe(15)
      expect(status.longestStreak).toBe(20)
    })
  })
})
