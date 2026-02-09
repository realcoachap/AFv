'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface ClientQuickBookModalProps {
  isOpen: boolean
  onClose: () => void
  slotStart: Date
  slotEnd: Date
  onSuccess: () => void
}

export default function ClientQuickBookModal({
  isOpen,
  onClose,
  slotStart,
  slotEnd,
  onSuccess,
}: ClientQuickBookModalProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    sessionType: 'ONE_ON_ONE',
    duration: 60,
    clientNotes: '',
    time: format(slotStart, 'HH:mm'), // Add time field
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      // Combine date from slotStart with time from formData
      const dateStr = format(slotStart, 'yyyy-MM-dd')
      const dateTime = new Date(`${dateStr}T${formData.time}`).toISOString()
      
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateTime,
          duration: formData.duration,
          sessionType: formData.sessionType,
          clientNotes: formData.clientNotes || undefined,
          status: 'PENDING_APPROVAL', // Client bookings need approval
        }),
      })

      if (response.ok) {
        // Reset form
        setFormData({
          sessionType: 'ONE_ON_ONE',
          duration: 60,
          clientNotes: '',
        })
        onSuccess()
        onClose()
        alert('✅ Session request sent! Your trainer will confirm shortly.')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to request session')
      }
    } catch (err) {
      setError('Failed to request session')
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setFormData({
      sessionType: 'ONE_ON_ONE',
      duration: 60,
      clientNotes: '',
      time: format(slotStart, 'HH:mm'),
    })
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#1A2332]">Request a Session</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="mb-4 space-y-3">
          <div className="p-3 bg-[#FFFBF5] border border-[#E8DCC4] rounded">
            <p className="text-sm text-gray-700">
              <strong>Date:</strong> {format(slotStart, 'EEEE, MMM d, yyyy')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent text-sm"
              required
            />
          </div>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          💡 Your trainer will review and confirm this session request.
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Session Type & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Type *
              </label>
              <select
                value={formData.sessionType}
                onChange={(e) =>
                  setFormData({ ...formData, sessionType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent text-sm"
              >
                <option value="ONE_ON_ONE">1-on-1</option>
                <option value="GROUP">Group</option>
                <option value="ASSESSMENT">Assessment</option>
                <option value="CHECK_IN">Check-in</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration *
              </label>
              <select
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent text-sm"
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={formData.clientNotes}
              onChange={(e) =>
                setFormData({ ...formData, clientNotes: e.target.value })
              }
              rows={3}
              placeholder="Any special requests or areas to focus on..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-[#E8DCC4] text-[#1A2332] rounded-lg font-semibold hover:bg-[#D8CCA4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {saving ? 'Requesting...' : 'Request Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
