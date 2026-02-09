'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, parseISO, isFuture, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

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
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadSchedule()
    loadStats()
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
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = parseISO(apt.dateTime)
    
    // Time filter
    if (filter === 'upcoming' && !isFuture(aptDate)) return false
    if (filter === 'past' && isFuture(aptDate)) return false
    
    // Status filter
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false
    
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-[#1A2332] text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Ascending Fitness - Admin</h1>
            <Link href="/admin/dashboard" className="text-[#E8DCC4] hover:underline">
              ← Dashboard
            </Link>
          </div>
        </nav>
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
      <nav className="bg-[#1A2332] text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Ascending Fitness - Admin</h1>
          <Link href="/admin" className="text-[#E8DCC4] hover:underline">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1A2332]">Schedule Management</h2>
            <Link
              href="/admin/schedule/new"
              className="px-4 py-2 bg-[#E8DCC4] text-[#1A2332] rounded-lg font-semibold hover:bg-[#D8CCA4] transition-colors"
            >
              + New Session
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2 border-b border-gray-200">
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E8DCC4]"
            >
              <option value="all">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING_APPROVAL">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>

          {/* Sessions List */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No sessions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <AdminSessionCard
                  key={apt.id}
                  appointment={apt}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
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

function AdminSessionCard({
  appointment,
  onStatusChange,
}: {
  appointment: Appointment
  onStatusChange: (id: string, status: string) => void
}) {
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

      {(appointment.notes || appointment.clientNotes) && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-sm">
          {appointment.clientNotes && (
            <p className="text-gray-600">
              <span className="font-medium">Client Notes:</span> {appointment.clientNotes}
            </p>
          )}
          {appointment.notes && (
            <p className="text-gray-600">
              <span className="font-medium">Coach Notes:</span> {appointment.notes}
            </p>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
        {appointment.status === 'PENDING_APPROVAL' && (
          <>
            <button
              onClick={() => onStatusChange(appointment.id, 'CONFIRMED')}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => onStatusChange(appointment.id, 'CANCELLED')}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Decline
            </button>
          </>
        )}
        {appointment.status === 'CONFIRMED' && isUpcoming && (
          <>
            <button
              onClick={() => onStatusChange(appointment.id, 'COMPLETED')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Mark Completed
            </button>
            <button
              onClick={() => onStatusChange(appointment.id, 'NO_SHOW')}
              className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
            >
              No Show
            </button>
            <button
              onClick={() => onStatusChange(appointment.id, 'CANCELLED')}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Cancel
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
