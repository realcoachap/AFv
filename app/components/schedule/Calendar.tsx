'use client'

import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react'

const localizer = momentLocalizer(moment)

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: {
    sessionType: string
    location: string | null
    status: string
    clientName?: string
    phone?: string
  }
}

interface CalendarProps {
  appointments: any[]
  onSelectEvent?: (event: CalendarEvent) => void
  isAdmin?: boolean
}

export default function Calendar({ appointments, onSelectEvent, isAdmin = false }: CalendarProps) {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  // Convert appointments to calendar events
  const events: CalendarEvent[] = appointments.map((apt) => {
    const start = new Date(apt.dateTime)
    const end = new Date(start.getTime() + apt.duration * 60000)
    
    const clientName = apt.client?.clientProfile?.fullName || apt.client?.email || 'Client'
    const sessionTypeLabels: Record<string, string> = {
      ONE_ON_ONE: '1-on-1',
      GROUP: 'Group',
      ASSESSMENT: 'Assessment',
      CHECK_IN: 'Check-in',
    }
    
    const title = isAdmin 
      ? `${sessionTypeLabels[apt.sessionType] || apt.sessionType} - ${clientName}`
      : sessionTypeLabels[apt.sessionType] || apt.sessionType

    return {
      id: apt.id,
      title,
      start,
      end,
      resource: {
        sessionType: apt.sessionType,
        location: apt.location,
        status: apt.status,
        clientName,
        phone: apt.client?.clientProfile?.phone,
      },
    }
  })

  // Custom event styling
  const eventStyleGetter = (event: CalendarEvent) => {
    const statusColors: Record<string, { bg: string; border: string }> = {
      CONFIRMED: { bg: '#10B981', border: '#059669' },
      PENDING_APPROVAL: { bg: '#F59E0B', border: '#D97706' },
      COMPLETED: { bg: '#6B7280', border: '#4B5563' },
      CANCELLED: { bg: '#EF4444', border: '#DC2626' },
      NO_SHOW: { bg: '#EF4444', border: '#DC2626' },
    }

    const colors = statusColors[event.resource.status] || { bg: '#E8DCC4', border: '#1A2332' }

    return {
      style: {
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.875rem',
        padding: '4px 8px',
      },
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4" style={{ height: '700px' }}>
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        
        .rbc-header {
          padding: 12px 6px;
          font-weight: 600;
          background: #F9FAFB;
          border-bottom: 2px solid #E5E7EB;
          color: #1A2332;
        }
        
        .rbc-today {
          background-color: #FEF3C7 !important;
        }
        
        .rbc-off-range-bg {
          background-color: #F9FAFB;
        }
        
        .rbc-event {
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        
        .rbc-event:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .rbc-toolbar {
          padding: 12px 0;
          margin-bottom: 16px;
        }
        
        .rbc-toolbar button {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #E5E7EB;
          background: white;
          color: #1A2332;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .rbc-toolbar button:hover {
          background: #F3F4F6;
          border-color: #E8DCC4;
        }
        
        .rbc-toolbar button.rbc-active {
          background: #E8DCC4;
          border-color: #1A2332;
          color: #1A2332;
        }
        
        .rbc-month-view {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .rbc-day-bg {
          border-color: #E5E7EB;
        }
        
        .rbc-date-cell {
          padding: 8px;
          text-align: right;
          color: #6B7280;
        }
        
        .rbc-current .rbc-date-cell {
          font-weight: 700;
          color: #1A2332;
        }
      `}</style>
      
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={(newView) => setView(newView as 'month' | 'week' | 'day')}
        views={['month', 'week', 'day']}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
        popup
        style={{ height: '100%' }}
      />
    </div>
  )
}
