'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type LogWorkoutModalProps = {
  onClose: () => void
}

export default function LogWorkoutModal({ onClose }: LogWorkoutModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date
    focusType: 'BALANCED' as 'STRENGTH' | 'CARDIO' | 'BALANCED',
    duration: '',
    notes: '',
  })

  // Get date 7 days ago for min date
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const minDate = sevenDaysAgo.toISOString().split('T')[0]
  
  // Today for max date
  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/client/log-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to log workout')
      }

      router.refresh()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-[#1A2332] mb-4">
          💪 Log Your Workout
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              min={minDate}
              max={today}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Can log workouts from the past 7 days
            </p>
          </div>

          {/* Focus Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-[#E8DCC4] transition-colors">
                <input
                  type="radio"
                  name="focusType"
                  value="STRENGTH"
                  checked={formData.focusType === 'STRENGTH'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      focusType: e.target.value as 'STRENGTH',
                    })
                  }
                  className="mr-3"
                />
                <div>
                  <span className="font-semibold text-[#1A2332]">
                    💪 Strength Training
                  </span>
                  <p className="text-xs text-gray-500">
                    Weights, resistance, lifting
                  </p>
                </div>
              </label>

              <label className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-[#E8DCC4] transition-colors">
                <input
                  type="radio"
                  name="focusType"
                  value="CARDIO"
                  checked={formData.focusType === 'CARDIO'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      focusType: e.target.value as 'CARDIO',
                    })
                  }
                  className="mr-3"
                />
                <div>
                  <span className="font-semibold text-[#1A2332]">
                    🏃 Cardio/Endurance
                  </span>
                  <p className="text-xs text-gray-500">
                    Running, biking, HIIT, cardio
                  </p>
                </div>
              </label>

              <label className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-[#E8DCC4] transition-colors">
                <input
                  type="radio"
                  name="focusType"
                  value="BALANCED"
                  checked={formData.focusType === 'BALANCED'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      focusType: e.target.value as 'BALANCED',
                    })
                  }
                  className="mr-3"
                />
                <div>
                  <span className="font-semibold text-[#1A2332]">
                    ⚡ Balanced Workout
                  </span>
                  <p className="text-xs text-gray-500">
                    Full body, mixed exercises
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Duration (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                min="5"
                max="300"
                placeholder="60"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
              />
              <span className="text-gray-600">minutes</span>
            </div>
          </div>

          {/* Notes (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="What did you work on?"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
            />
          </div>

          {/* XP Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-purple-900">
              Rewards: +75 XP, +1 {formData.focusType === 'STRENGTH' ? 'Strength' : formData.focusType === 'CARDIO' ? 'Endurance' : 'Both Stats'} 🎮
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#1A2332] text-white rounded-md hover:bg-[#2A3342] transition-colors disabled:opacity-50 font-semibold"
            >
              {loading ? 'Logging...' : 'Log Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
