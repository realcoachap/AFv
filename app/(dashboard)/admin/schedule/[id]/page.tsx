'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Client {
  id: string
  email: string
  clientProfile: {
    fullName: string
  } | null
}

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

interface Appointment {
  id: string
  clientId: string
  dateTime: string
  duration: number
  sessionType: string
  location: string | null
  notes: string | null
  clientNotes: string | null
  status: string
  client: {
    email: string
    clientProfile: {
      fullName: string
      phone: string
    } | null
  }
}

export default function EditSessionPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [appointment, setAppointment] = useState<Appointment | null>(null)

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 60,
    sessionType: 'ONE_ON_ONE',
    location: 'LA Fitness',
    notes: '',
    clientNotes: '',
    status: 'CONFIRMED',
  })

  useEffect(() => {
    loadSession()
  }, [sessionId])

  async function loadSession() {
    try {
      const response = await fetch(`/api/schedule/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        const apt = data.appointment

        // Parse the ISO dateTime into date and time
        const dateTime = new Date(apt.dateTime)
        const date = dateTime.toISOString().split('T')[0]
        const time = dateTime.toTimeString().slice(0, 5)

        setAppointment(apt)
        setFormData({
          date,
          time,
          duration: apt.duration,
          sessionType: apt.sessionType,
          location: apt.location || 'LA Fitness',
          notes: apt.notes || '',
          clientNotes: apt.clientNotes || '',
          status: apt.status,
        })
      } else {
        setError('Session not found')
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      setError('Failed to load session')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!formData.date || !formData.time) {
      setError('Please fill in date and time')
      return
    }

    setSaving(true)

    try {
      // Combine date and time into ISO string
      const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString()

      const response = await fetch(`/api/schedule/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateTime,
          duration: formData.duration,
          sessionType: formData.sessionType,
          location: formData.location || undefined,
          notes: formData.notes || undefined,
          clientNotes: formData.clientNotes || undefined,
          status: formData.status,
        }),
      })

      if (response.ok) {
        router.push('/admin/schedule')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update session')
      }
    } catch (err) {
      setError('Failed to update session')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to cancel this session?')) {
      return
    }

    try {
      const response = await fetch(`/api/schedule/${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/schedule')
      } else {
        setError('Failed to cancel session')
      }
    } catch (err) {
      setError('Failed to cancel session')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A2332]"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !appointment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-[#1A2332] text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">🏋️ Ascending Fitness - Admin</h1>
            <Link href="/admin/schedule" className="text-[#E8DCC4] hover:underline">
              ← Back to Schedule
            </Link>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A2332] text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🏋️ Ascending Fitness - Admin</h1>
          <Link href="/admin/schedule" className="text-[#E8DCC4] hover:underline">
            ← Back to Schedule
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-[#1A2332] mb-2">
            Edit Session
          </h2>
          <p className="text-gray-600 mb-6">
            Client: {appointment?.client.clientProfile?.fullName || appointment?.client.email}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
              >
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
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
                placeholder="e.g., LA Fitness, Client Home, Virtual"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
              />
            </div>

            {/* Coach Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coach Notes (private)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                placeholder="Internal notes for yourself..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
              />
            </div>

            {/* Client Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Notes (visible to client)
              </label>
              <textarea
                value={formData.clientNotes}
                onChange={(e) =>
                  setFormData({ ...formData, clientNotes: e.target.value })
                }
                rows={2}
                placeholder="Notes visible to the client..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4] focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-between pt-4 border-t">
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Cancel Session
              </button>
              <div className="flex gap-4">
                <Link
                  href="/admin/schedule"
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center"
                >
                  Back
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-[#E8DCC4] text-[#1A2332] rounded-lg font-semibold hover:bg-[#D8CCA4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
