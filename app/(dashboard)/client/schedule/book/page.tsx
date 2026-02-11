'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/app/components/NavBar'

// Generate time options in 30-minute increments
function generateTimeOptions() {
  const times = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const ampm = hour < 12 ? 'AM' : 'PM'
      const hourStr = hour.toString().padStart(2, '0')
      const minuteStr = minute.toString().padStart(2, '0')
      const value = `${hourStr}:${minuteStr}`
      const label = `${hour12}:${minuteStr} ${ampm}`
      times.push({ value, label })
    }
  }
  return times
}

export default function BookSessionPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 60,
    sessionType: 'ONE_ON_ONE',
    clientNotes: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!formData.date || !formData.time) {
      setError('Please select both date and time')
      return
    }

    // Check if date is in the future
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`)
    if (selectedDateTime <= new Date()) {
      setError('Please select a future date and time')
      return
    }

    setSaving(true)

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString()

      const response = await fetch('/api/client/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateTime,
          duration: formData.duration,
          sessionType: formData.sessionType,
          clientNotes: formData.clientNotes || undefined,
        }),
      })

      if (response.ok) {
        alert('✅ Session request submitted!\n\nYour coach will review and approve it shortly.')
        router.push('/client/schedule')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit booking request')
      }
    } catch (err) {
      setError('Failed to submit booking request')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar role="client" backLink="/client/schedule" backText="← Back to Schedule" />

      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-[#1A2332] mb-2">
            Book a Session
          </h2>
          <p className="text-gray-600 mb-6">
            Request a training session. Your coach will review and confirm.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time *
                </label>
                <select
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                >
                  <option value="">Select time...</option>
                  {generateTimeOptions().map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration & Session Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Duration *
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Type *
                </label>
                <select
                  value={formData.sessionType}
                  onChange={(e) =>
                    setFormData({ ...formData, sessionType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                >
                  <option value="ONE_ON_ONE">1-on-1 Training</option>
                  <option value="GROUP">Group Session</option>
                  <option value="ASSESSMENT">Assessment</option>
                  <option value="CHECK_IN">Check-in</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={formData.clientNotes}
                onChange={(e) =>
                  setFormData({ ...formData, clientNotes: e.target.value })
                }
                rows={4}
                placeholder="Any preferences, goals for this session, or questions for your coach..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📋 What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Your request will be sent to your coach</li>
                <li>✓ You'll see it as "Pending Approval" in your schedule</li>
                <li>✓ Your coach will review and confirm the time</li>
                <li>✓ You'll be notified once it's confirmed</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-4 border-t">
              <Link
                href="/client/schedule"
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#E8DCC4] text-[#1A2332] rounded-lg font-semibold hover:bg-[#D8CCA4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Submitting...' : 'Request Session'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
