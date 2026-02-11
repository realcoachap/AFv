import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '@/app/api/client/log-workout/route'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { onSessionComplete } from '@/app/lib/rpg/session-integration'

// Mock dependencies
vi.mock('@/auth', () => ({
  auth: vi.fn()
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    appointment: {
      create: vi.fn()
    }
  }
}))

vi.mock('@/app/lib/rpg/session-integration', () => ({
  onSessionComplete: vi.fn()
}))

describe('POST /api/client/log-workout', () => {
  const mockClientSession = {
    user: {
      id: 'client-123',
      role: 'CLIENT'
    }
  }

  const mockAdminSession = {
    user: {
      id: 'admin-123',
      role: 'ADMIN'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================================
  // AUTHENTICATION TESTS
  // ============================================================
  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null)

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: new Date().toISOString(),
          focusType: 'STRENGTH'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 401 when user is not a CLIENT role', async () => {
      vi.mocked(auth).mockResolvedValue(mockAdminSession as any)

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: new Date().toISOString(),
          focusType: 'STRENGTH'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should proceed when client is authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(mockClientSession as any)
      vi.mocked(prisma.appointment.create).mockResolvedValue({
        id: 'appointment-123',
        clientId: 'client-123'
      } as any)
      vi.mocked(onSessionComplete).mockResolvedValue({
        success: true,
        xpAwarded: 75,
        statsUpdated: { strength: 1 },
        streakUpdate: {
          currentStreak: 1,
          longestStreak: 1,
          bonusAwarded: false,
          disciplineGained: false
        }
      })

      const today = new Date().toISOString().split('T')[0]
      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'STRENGTH'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  // ============================================================
  // VALIDATION TESTS
  // ============================================================
  describe('Input Validation', () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue(mockClientSession as any)
    })

    it('should return 400 for invalid focusType', async () => {
      const today = new Date().toISOString().split('T')[0]
      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'INVALID_TYPE'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should return 400 for missing date', async () => {
      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          focusType: 'STRENGTH'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should accept valid STRENGTH focusType', async () => {
      vi.mocked(prisma.appointment.create).mockResolvedValue({ id: 'apt-1' } as any)
      vi.mocked(onSessionComplete).mockResolvedValue({ success: true } as any)

      const today = new Date().toISOString().split('T')[0]
      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'STRENGTH'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })

    it('should accept valid CARDIO focusType', async () => {
      vi.mocked(prisma.appointment.create).mockResolvedValue({ id: 'apt-1' } as any)
      vi.mocked(onSessionComplete).mockResolvedValue({ success: true } as any)

      const today = new Date().toISOString().split('T')[0]
      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'CARDIO'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })

    it('should accept valid BALANCED focusType', async () => {
      vi.mocked(prisma.appointment.create).mockResolvedValue({ id: 'apt-1' } as any)
      vi.mocked(onSessionComplete).mockResolvedValue({ success: true } as any)

      const today = new Date().toISOString().split('T')[0]
      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'BALANCED'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  // ============================================================
  // DATE VALIDATION TESTS
  // ============================================================
  describe('Date Validation', () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue(mockClientSession as any)
    })

    it('should reject dates older than 7 days', async () => {
      const eightDaysAgo = new Date()
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8)

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: eightDaysAgo.toISOString(),
          focusType: 'STRENGTH'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('past 7 days')
    })

    it('should reject future dates', async () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: tomorrow.toISOString(),
          focusType: 'STRENGTH'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('past 7 days')
    })

    it('should accept dates exactly 7 days ago', async () => {
      vi.mocked(prisma.appointment.create).mockResolvedValue({ id: 'apt-1' } as any)
      vi.mocked(onSessionComplete).mockResolvedValue({ success: true } as any)

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: sevenDaysAgo.toISOString(),
          focusType: 'STRENGTH'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })

    it('should accept today\'s date', async () => {
      vi.mocked(prisma.appointment.create).mockResolvedValue({ id: 'apt-1' } as any)
      vi.mocked(onSessionComplete).mockResolvedValue({ success: true } as any)

      const today = new Date().toISOString()

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'STRENGTH'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  // ============================================================
  // OPTIONAL FIELDS TESTS
  // ============================================================
  describe('Optional Fields', () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue(mockClientSession as any)
      vi.mocked(prisma.appointment.create).mockResolvedValue({ id: 'apt-1' } as any)
      vi.mocked(onSessionComplete).mockResolvedValue({ success: true } as any)
    })

    it('should create workout without duration', async () => {
      const today = new Date().toISOString()

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'STRENGTH'
          // duration is optional
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
      expect(prisma.appointment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            duration: 60 // default value
          })
        })
      )
    })

    it('should accept valid duration', async () => {
      const today = new Date().toISOString()

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'STRENGTH',
          duration: '90'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
      expect(prisma.appointment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            duration: 90
          })
        })
      )
    })

    it('should accept notes field', async () => {
      const today = new Date().toISOString()

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'STRENGTH',
          notes: 'Great chest and triceps workout!'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })

    it('should handle empty notes', async () => {
      const today = new Date().toISOString()

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'STRENGTH',
          notes: ''
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })
  })

  // ============================================================
  // RPG INTEGRATION TESTS
  // ============================================================
  describe('RPG Integration', () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue(mockClientSession as any)
      vi.mocked(prisma.appointment.create).mockResolvedValue({
        id: 'appointment-123',
        clientId: 'client-123'
      } as any)
    })

    it('should award 75 XP for self-logged workouts', async () => {
      vi.mocked(onSessionComplete).mockResolvedValue({
        success: true,
        xpAwarded: 75,
        statsUpdated: { strength: 1 },
        streakUpdate: {
          currentStreak: 1,
          longestStreak: 1,
          bonusAwarded: false,
          disciplineGained: false
        }
      })

      const today = new Date().toISOString()

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'STRENGTH'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.rpg.xpAwarded).toBe(75)
    })

    it('should handle RPG integration failure gracefully', async () => {
      vi.mocked(onSessionComplete).mockResolvedValue({
        success: false,
        error: 'RPG system unavailable'
      } as any)

      const today = new Date().toISOString()

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'STRENGTH'
        })
      })

      // Should still return success even if RPG fails
      const response = await POST(request)
      expect(response.status).toBe(200)
    })

    it('should pass correct parameters to onSessionComplete', async () => {
      vi.mocked(onSessionComplete).mockResolvedValue({
        success: true,
        xpAwarded: 75,
        statsUpdated: {},
        streakUpdate: {
          currentStreak: 1,
          longestStreak: 1,
          bonusAwarded: false,
          disciplineGained: false
        }
      })

      const today = new Date().toISOString()

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'STRENGTH'
        })
      })

      await POST(request)

      expect(onSessionComplete).toHaveBeenCalledWith(
        'appointment-123',
        'client-123',
        'STRENGTH',
        'SELF_LOGGED'
      )
    })
  })

  // ============================================================
  // ERROR HANDLING TESTS
  // ============================================================
  describe('Error Handling', () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue(mockClientSession as any)
    })

    it('should return 500 on database error', async () => {
      vi.mocked(prisma.appointment.create).mockRejectedValue(new Error('DB connection failed'))

      const today = new Date().toISOString()

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today,
          focusType: 'STRENGTH'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to log workout')
    })

    it('should return 400 on malformed JSON', async () => {
      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: 'not valid json'
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should handle null request body', async () => {
      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: null as any
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })

  // ============================================================
  // DATABASE CREATION TESTS
  // ============================================================
  describe('Database Creation', () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue(mockClientSession as any)
      vi.mocked(onSessionComplete).mockResolvedValue({ success: true } as any)
    })

    it('should create appointment with correct default values', async () => {
      const today = new Date()
      vi.mocked(prisma.appointment.create).mockResolvedValue({
        id: 'apt-1',
        clientId: 'client-123'
      } as any)

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today.toISOString(),
          focusType: 'STRENGTH'
        })
      })

      await POST(request)

      expect(prisma.appointment.create).toHaveBeenCalledWith({
        data: {
          clientId: 'client-123',
          dateTime: expect.any(Date),
          duration: 60,
          sessionType: 'ONE_ON_ONE',
          focusType: 'STRENGTH',
          workoutType: 'SELF_LOGGED',
          status: 'COMPLETED',
          bookedBy: 'CLIENT',
          clientNotes: undefined
        }
      })
    })

    it('should include client notes when provided', async () => {
      const today = new Date()
      vi.mocked(prisma.appointment.create).mockResolvedValue({
        id: 'apt-1',
        clientId: 'client-123'
      } as any)

      const request = new Request('http://localhost/api/client/log-workout', {
        method: 'POST',
        body: JSON.stringify({
          date: today.toISOString(),
          focusType: 'STRENGTH',
          notes: 'Intense leg day!'
        })
      })

      await POST(request)

      expect(prisma.appointment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          clientNotes: 'Intense leg day!'
        })
      })
    })
  })
})
