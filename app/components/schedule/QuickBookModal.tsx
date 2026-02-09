'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface QuickBookModalProps {
  isOpen: boolean
  onClose: () => void
  slotStart: Date
  slotEnd: Date
  onSuccess: () => void
}

interface Client {
  id: string
  email: string
  clientProfile: {
    fullName: string
  } | null
}

export default function QuickBookModal({
  isOpen,
  onClose,
  slotStart,
  slotEnd,
  onSuccess,
}: QuickBookModalProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    clientId: '',
    sessionType: 'ONE_ON_ONE',
    duration: 60,
    location: 'LA Fitness',
    notes: '',
    clientNotes: '',
    time: format(slotStart, 'HH:mm'), // Add time field
  })

  useEffect(() => {
    if (isOpen) {
      loadClients()
    }
  }, [isOpen])

  async function loadClients() {
    try {
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/admin/clients?_t=${timestamp}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })
      if (response.ok) {
        const data = await response.json()
        setClients(data.clients)
      }
    } catch (error) {
      console.error('Failed to load clients:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!formData.clientId) {
      setError('Please select a client')
      return
    }

    setSaving(true)

    try {
      // Combine date from slotStart with time from formData
      const dateStr = format(slotStart, 'yyyy-MM-dd')
      const dateTime = new Date(`${dateStr}T${formData.time}`).toISOString()
      
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: formData.clientId,
          dateTime,
          duration: formData.duration,
          sessionType: formData.sessionType,
          location: formData.location || undefined,
          notes: formData.notes || undefined,
          clientNotes: formData.clientNotes || undefined,
        }),
      })

      if (response.ok) {
        // Reset form
        setFormData({
          clientId: '',
          sessionType: 'ONE_ON_ONE',
          duration: 60,
          location: 'LA Fitness',
          notes: '',
          clientNotes: '',
          time: format(new Date(), 'HH:mm'),
        })
        onSuccess()
        onClose()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create session')
      }
    } catch (err) {
      setError('Failed to create session')
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setFormData({
      clientId: '',
      sessionType: 'ONE_ON_ONE',
      duration: 60,
      location: 'LA Fitness',
      notes: '',
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
          <h3 className="text-xl font-bold text-[#1A2332]">Quick Book Session</h3>
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#1A2332]"></div>
            <p className="mt-2 text-sm text-gray-600">Loading clients...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client *
              </label>
              <select
                value={formData.clientId}
                onChange={(e) =>
                  setFormData({ ...formData, clientId: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent text-sm"
              >
                <option value="">Select a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientProfile?.fullName || client.email}
                  </option>
                ))}
              </select>
            </div>

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

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., LA Fitness, Virtual"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent text-sm"
              />
            </div>

            {/* Quick Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quick Notes (optional)
              </label>
              <textarea
                value={formData.clientNotes}
                onChange={(e) =>
                  setFormData({ ...formData, clientNotes: e.target.value })
                }
                rows={2}
                placeholder="Any notes for the client..."
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
                {saving ? 'Booking...' : 'Book Session'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
