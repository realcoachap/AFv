'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, parseISO, isFuture, isPast } from 'date-fns'

interface Appointment {
  id: string
  dateTime: string
  duration: number
  sessionType: string
  location: string | null
  status: string
  notes: string | null
  clientNotes: string | null
  client: {
    clientProfile: {
      fullName: string
    } | null
  }
}

export default function ClientSchedulePage() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming')

  useEffect(() => {
    loadSchedule()
  }, [])

  async function loadSchedule() {
    try {
      const response = await fetch('/api/schedule')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments)
      }
    } catch (error) {
      console.error('Failed to load schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = parseISO(apt.dateTime)
    if (filter === 'upcoming') return isFuture(aptDate)
    if (filter === 'past') return isPast(aptDate)
    return true
  })

  const upcomingCount = appointments.filter((apt) =>
    isFuture(parseISO(apt.dateTime))
  ).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-[#1A2332] text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Ascending Fitness</h1>
            <Link href="/client/dashboard" className="text-[#E8DCC4] hover:underline">
              ← Dashboard
            </Link>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A2332]"></div>
            <p className="mt-2 text-gray-600">Loading schedule...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A2332] text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Ascending Fitness</h1>
          <Link href="/client/dashboard" className="text-[#E8DCC4] hover:underline">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A2332]">My Schedule</h2>
              <p className="text-gray-600 mt-1">
                {upcomingCount} upcoming session{upcomingCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'text-[#1A2332] border-b-2 border-[#E8DCC4]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'past'
                  ? 'text-[#1A2332] border-b-2 border-[#E8DCC4]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'all'
                  ? 'text-[#1A2332] border-b-2 border-[#E8DCC4]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
          </div>

          {/* Sessions List */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No sessions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <SessionCard key={apt.id} appointment={apt} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function SessionCard({ appointment }: { appointment: Appointment }) {
  const aptDate = parseISO(appointment.dateTime)
  const isUpcoming = isFuture(aptDate)

  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-800',
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    NO_SHOW: 'bg-red-100 text-red-800',
  }

  const sessionTypeLabels: Record<string, string> = {
    ONE_ON_ONE: '1-on-1 Training',
    GROUP: 'Group Session',
    ASSESSMENT: 'Assessment',
    CHECK_IN: 'Check-in',
  }

  return (
    <div
      className={`border rounded-lg p-4 ${
        isUpcoming ? 'border-[#E8DCC4] bg-[#FFFBF5]' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-[#1A2332] text-lg">
            {sessionTypeLabels[appointment.sessionType] || appointment.sessionType}
          </h3>
          <p className="text-sm text-gray-600">
            {format(aptDate, 'EEEE, MMMM d, yyyy')} at {format(aptDate, 'h:mm a')}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[appointment.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {appointment.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <span className="text-gray-500">Duration:</span>
          <span className="ml-2 font-medium">{appointment.duration} min</span>
        </div>
        {appointment.location && (
          <div>
            <span className="text-gray-500">Location:</span>
            <span className="ml-2 font-medium">{appointment.location}</span>
          </div>
        )}
      </div>

      {appointment.clientNotes && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {appointment.clientNotes}
          </p>
        </div>
      )}
    </div>
  )
}
