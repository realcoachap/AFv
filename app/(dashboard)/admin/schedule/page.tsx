'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import Calendar from '@/app/components/schedule/Calendar'
import NavBar from '@/app/components/NavBar'
import QuickBookModal from '@/app/components/schedule/QuickBookModal'

interface Client {
  id: string
  email: string
  clientProfile: {
    fullName: string
    phone: string
  } | null
}

interface Appointment {
  id: string
  dateTime: string
  duration: number
  sessionType: string
  location: string | null
  status: string
  notes: string | null
  clientNotes: string | null
  client: Client
}

interface Stats {
  totalUpcoming: number
  todaySessions: number
  thisWeekSessions: number
  thisMonthSessions: number
  pendingApprovals: number
}

export default function AdminSchedulePage() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null)
  const [sendingReminder, setSendingReminder] = useState(false)
  const [quickBookModalOpen, setQuickBookModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null)

  useEffect(() => {
    loadSchedule()
    loadStats()
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

  async function loadStats() {
    try {
      const response = await fetch('/api/admin/schedule/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  async function handleStatusChange(appointmentId: string, newStatus: string) {
    try {
      const response = await fetch(`/api/schedule/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        loadSchedule()
        loadStats()
        setSelectedEvent(null)
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  async function sendReminder(appointmentId: string, reminderType: string) {
    setSendingReminder(true)
    try {
      const response = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, reminderType }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Message sent successfully!
        alert(`✅ WhatsApp Reminder Sent!\n\nTo: ${data.phone}\n\n"${data.messageText}"\n\nMessage ID: ${data.messageId}`)
      } else if (data.dryRun) {
        // Not configured yet - show setup instructions
        alert(`⚠️  WhatsApp Not Configured\n\n${data.error}\n\n${data.instructions}\n\nMessage Preview:\n"${data.message}"\n\nTo: ${data.phone}`)
      } else {
        alert(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Failed to send reminder:', error)
      alert('❌ Failed to send reminder')
    } finally {
      setSendingReminder(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar role="admin" backLink="/admin/dashboard" backText="← Dashboard" />
        <main className="max-w-7xl mx-auto p-6">
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
      <NavBar role="admin" backLink="/admin/dashboard" backText="← Dashboard" />

      <main className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <StatCard label="Today" value={stats.todaySessions} />
            <StatCard label="This Week" value={stats.thisWeekSessions} />
            <StatCard label="This Month" value={stats.thisMonthSessions} />
            <StatCard label="Upcoming" value={stats.totalUpcoming} />
            <StatCard
              label="Pending"
              value={stats.pendingApprovals}
              highlight={stats.pendingApprovals > 0}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A2332]">Schedule Management</h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* View Toggle */}
              <div className="flex gap-1 sm:gap-2 border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('calendar')}
                  className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base transition-colors ${
                    view === 'calendar'
                      ? 'bg-[#E8DCC4] text-[#1A2332]'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📅 <span className="hidden sm:inline">Calendar</span>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base transition-colors ${
                    view === 'list'
                      ? 'bg-[#E8DCC4] text-[#1A2332]'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📋 <span className="hidden sm:inline">List</span>
                </button>
              </div>
              
              <Link
                href="/admin/schedule/new"
                className="px-3 sm:px-4 py-2 bg-[#E8DCC4] text-[#1A2332] rounded-lg font-semibold text-sm sm:text-base hover:bg-[#D8CCA4] transition-colors whitespace-nowrap"
              >
                <span className="sm:hidden">+ New</span>
                <span className="hidden sm:inline">+ New Session</span>
              </Link>
            </div>
          </div>

          {/* Calendar View */}
          {view === 'calendar' && (
            <>
              <div className="mb-3 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-800">
                  💡 <strong className="hidden sm:inline">Tip: </strong>
                  <span className="sm:hidden">Tap </span>
                  <span className="hidden sm:inline">Click </span>
                  any empty slot to quickly book a session!
                </p>
              </div>
              <Calendar
                appointments={appointments}
                onSelectEvent={(event) => {
                  const apt = appointments.find((a) => a.id === event.id)
                  setSelectedEvent(apt || null)
                }}
                onSelectSlot={(slotInfo) => {
                  setSelectedSlot(slotInfo)
                  setQuickBookModalOpen(true)
                }}
                isAdmin
              />
            </>
          )}

          {/* List View */}
          {view === 'list' && (
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No sessions scheduled</p>
                </div>
              ) : (
                appointments.map((apt) => (
                  <SessionCard
                    key={apt.id}
                    appointment={apt}
                    onStatusChange={handleStatusChange}
                    onSendReminder={sendReminder}
                    sendingReminder={sendingReminder}
                  />
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
                onStatusChange={handleStatusChange}
                onSendReminder={sendReminder}
                sendingReminder={sendingReminder}
              />
            </div>
          </div>
        )}

        {/* Quick Book Modal */}
        {selectedSlot && (
          <QuickBookModal
            isOpen={quickBookModalOpen}
            onClose={() => {
              setQuickBookModalOpen(false)
              setSelectedSlot(null)
            }}
            slotStart={selectedSlot.start}
            slotEnd={selectedSlot.end}
            onSuccess={() => {
              loadSchedule()
              loadStats()
            }}
          />
        )}
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-lg p-4 ${
        highlight
          ? 'bg-yellow-50 border-2 border-yellow-200'
          : 'bg-white border border-gray-200'
      }`}
    >
      <p className="text-sm text-gray-600">{label}</p>
      <p
        className={`text-3xl font-bold ${
          highlight ? 'text-yellow-700' : 'text-[#1A2332]'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function SessionCard({
  appointment,
  onStatusChange,
  onSendReminder,
  sendingReminder,
}: {
  appointment: Appointment
  onStatusChange: (id: string, status: string) => void
  onSendReminder: (id: string, type: string) => void
  sendingReminder: boolean
}) {
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
    ONE_ON_ONE: '1-on-1',
    GROUP: 'Group',
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
            {appointment.client.clientProfile?.fullName || appointment.client.email}
          </h3>
          <p className="text-sm text-gray-600">
            {format(aptDate, 'EEEE, MMM d, yyyy')} at {format(aptDate, 'h:mm a')}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="px-2 py-1 rounded text-xs font-medium bg-[#E8DCC4] text-[#1A2332]">
            {sessionTypeLabels[appointment.sessionType] || appointment.sessionType}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[appointment.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {appointment.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
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
        {appointment.client.clientProfile?.phone && (
          <div>
            <span className="text-gray-500">Phone:</span>
            <span className="ml-2 font-medium">
              {appointment.client.clientProfile.phone}
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
        {appointment.status === 'CONFIRMED' && isUpcoming && (
          <>
            <button
              onClick={() => onSendReminder(appointment.id, 'general')}
              disabled={sendingReminder}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              📱 Send Reminder
            </button>
            <button
              onClick={() => onStatusChange(appointment.id, 'COMPLETED')}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              ✓ Complete
            </button>
          </>
        )}
        <Link
          href={`/admin/schedule/${appointment.id}`}
          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
          Edit
        </Link>
      </div>
    </div>
  )
}

function SessionDetail({
  appointment,
  onClose,
  onStatusChange,
  onSendReminder,
  sendingReminder,
}: {
  appointment: Appointment
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
  onSendReminder: (id: string, type: string) => void
  sendingReminder: boolean
}) {
  const aptDate = parseISO(appointment.dateTime)
  const isUpcoming = aptDate > new Date()

  const sessionTypeLabels: Record<string, string> = {
    ONE_ON_ONE: '1-on-1 Training',
    GROUP: 'Group Session',
    ASSESSMENT: 'Assessment',
    CHECK_IN: 'Check-in',
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

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm text-gray-500">Client</p>
          <p className="font-semibold">
            {appointment.client.clientProfile?.fullName || appointment.client.email}
          </p>
          {appointment.client.clientProfile?.phone && (
            <p className="text-sm text-gray-600">{appointment.client.clientProfile.phone}</p>
          )}
        </div>

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

        {appointment.clientNotes && (
          <div>
            <p className="text-sm text-gray-500">Client Notes</p>
            <p className="text-sm">{appointment.clientNotes}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t">
        {appointment.status === 'CONFIRMED' && isUpcoming && (
          <button
            onClick={() => {
              onSendReminder(appointment.id, 'general')
              onClose()
            }}
            disabled={sendingReminder}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            📱 Send WhatsApp Reminder
          </button>
        )}
        
        <Link
          href={`/admin/schedule/${appointment.id}`}
          className="w-full px-4 py-2 bg-[#E8DCC4] text-[#1A2332] rounded-lg font-semibold hover:bg-[#D8CCA4] text-center"
        >
          Edit Session
        </Link>
      </div>
    </div>
  )
}
