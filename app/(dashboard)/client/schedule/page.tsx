'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import Calendar from '@/app/components/schedule/Calendar'

interface Appointment {
  id: string
  dateTime: string
  duration: number
  sessionType: string
  location: string | null
  status: string
  notes: string | null
  clientNotes: string | null
}

export default function ClientSchedulePage() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null)

  useEffect(() => {
    loadSchedule()
  }, [])

  async function loadSchedule() {
    try {
      // Add timestamp to force cache bust
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/schedule?_t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
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

  const upcomingCount = appointments.filter((apt) =>
    new Date(apt.dateTime) > new Date()
  ).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-[#1A2332] text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">🏋️ Ascending Fitness</h1>
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
          <h1 className="text-xl font-bold">🏋️ Ascending Fitness</h1>
          <Link href="/client/dashboard" className="text-[#E8DCC4] hover:underline">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A2332]">My Schedule</h2>
              <p className="text-gray-600 mt-1">
                {upcomingCount} upcoming session{upcomingCount !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2 border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 font-medium transition-colors ${
                  view === 'calendar'
                    ? 'bg-[#E8DCC4] text-[#1A2332]'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                📅 Calendar
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-[#E8DCC4] text-[#1A2332]'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                📋 List
              </button>
            </div>
          </div>

          {/* Calendar View */}
          {view === 'calendar' && (
            <Calendar
              appointments={appointments}
              onSelectEvent={(event) => {
                const apt = appointments.find((a) => a.id === event.id)
                setSelectedEvent(apt || null)
              }}
              isAdmin={false}
            />
          )}

          {/* List View */}
          {view === 'list' && (
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No sessions found</p>
                </div>
              ) : (
                appointments.map((apt) => (
                  <SessionCard key={apt.id} appointment={apt} />
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected Event Modal */}
        {selectedEvent && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <SessionDetail
                appointment={selectedEvent}
                onClose={() => setSelectedEvent(null)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function SessionCard({ appointment }: { appointment: Appointment }) {
  const aptDate = parseISO(appointment.dateTime)
  const isUpcoming = aptDate > new Date()

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

function SessionDetail({
  appointment,
  onClose,
}: {
  appointment: Appointment
  onClose: () => void
}) {
  const aptDate = parseISO(appointment.dateTime)

  const sessionTypeLabels: Record<string, string> = {
    ONE_ON_ONE: '1-on-1 Training',
    GROUP: 'Group Session',
    ASSESSMENT: 'Assessment',
    CHECK_IN: 'Check-in',
  }

  const statusColors: Record<string, string> = {
    CONFIRMED: 'text-green-600',
    PENDING_APPROVAL: 'text-yellow-600',
    COMPLETED: 'text-gray-600',
    CANCELLED: 'text-red-600',
    NO_SHOW: 'text-red-600',
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-[#1A2332]">
          {sessionTypeLabels[appointment.sessionType] || appointment.sessionType}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Date & Time</p>
          <p className="font-semibold">
            {format(aptDate, 'EEEE, MMMM d, yyyy')}
          </p>
          <p className="text-sm">{format(aptDate, 'h:mm a')} ({appointment.duration} min)</p>
        </div>

        {appointment.location && (
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-semibold">{appointment.location}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className={`font-semibold ${statusColors[appointment.status]}`}>
            {appointment.status.replace('_', ' ')}
          </p>
        </div>

        {appointment.clientNotes && (
          <div>
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-sm">{appointment.clientNotes}</p>
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full mt-6 px-4 py-2 bg-[#E8DCC4] text-[#1A2332] rounded-lg font-semibold hover:bg-[#D8CCA4]"
      >
        Close
      </button>
    </div>
  )
}
