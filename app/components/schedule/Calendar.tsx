'use client'

import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react'

const localizer = momentLocalizer(moment)

// Client profile from Prisma relation
interface ClientProfile {
  fullName: string
  phone?: string
}

// Client data from Prisma relation
interface ClientData {
  id?: string
  email: string
  clientProfile?: ClientProfile | null
}

// Appointment with client relation from API
interface AppointmentWithClient {
  id: string
  dateTime: string
  duration: number
  sessionType: string
  location: string | null
  status: string
  client?: ClientData
}

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
  appointments: AppointmentWithClient[]
  onSelectEvent?: (event: CalendarEvent) => void
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void
  isAdmin?: boolean
}

export default function Calendar({ appointments, onSelectEvent, onSelectSlot, isAdmin = false }: CalendarProps) {
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
    <div className="bg-white rounded-lg shadow p-2 sm:p-4" style={{ height: '600px', minHeight: '500px' }}>
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        
        .rbc-header {
          padding: 8px 4px;
          font-weight: 600;
          background: #F9FAFB;
          border-bottom: 2px solid #E5E7EB;
          color: #1A2332;
          font-size: 0.75rem;
        }
        
        @media (min-width: 640px) {
          .rbc-header {
            padding: 12px 6px;
            font-size: 0.875rem;
          }
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
          font-size: 0.7rem;
          padding: 2px 4px !important;
        }
        
        @media (min-width: 640px) {
          .rbc-event {
            font-size: 0.875rem;
            padding: 4px 8px !important;
          }
        }
        
        .rbc-event:active {
          transform: scale(0.98);
        }
        
        @media (hover: hover) {
          .rbc-event:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
        }
        
        /* Mobile-friendly toolbar */
        .rbc-toolbar {
          padding: 8px 0;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        @media (min-width: 640px) {
          .rbc-toolbar {
            padding: 12px 0;
            margin-bottom: 16px;
          }
        }
        
        .rbc-toolbar button {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #E5E7EB;
          background: white;
          color: #1A2332;
          font-weight: 500;
          font-size: 0.75rem;
          transition: all 0.2s;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        @media (min-width: 640px) {
          .rbc-toolbar button {
            padding: 8px 16px;
            font-size: 0.875rem;
          }
        }
        
        .rbc-toolbar button:active {
          background: #F3F4F6;
          transform: scale(0.98);
        }
        
        @media (hover: hover) {
          .rbc-toolbar button:hover {
            background: #F3F4F6;
            border-color: #E8DCC4;
          }
        }
        
        .rbc-toolbar button.rbc-active {
          background: #E8DCC4;
          border-color: #1A2332;
          color: #1A2332;
        }
        
        .rbc-toolbar-label {
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        @media (min-width: 640px) {
          .rbc-toolbar-label {
            font-size: 1rem;
          }
        }
        
        .rbc-month-view {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .rbc-day-bg {
          border-color: #E5E7EB;
          min-height: 60px;
        }
        
        @media (min-width: 640px) {
          .rbc-day-bg {
            min-height: 80px;
          }
        }
        
        .rbc-date-cell {
          padding: 4px;
          text-align: right;
          color: #6B7280;
          font-size: 0.75rem;
        }
        
        @media (min-width: 640px) {
          .rbc-date-cell {
            padding: 8px;
            font-size: 0.875rem;
          }
        }
        
        .rbc-current .rbc-date-cell {
          font-weight: 700;
          color: #1A2332;
        }
        
        /* Better touch targets for mobile */
        .rbc-day-slot .rbc-time-slot {
          min-height: 44px;
        }
        
        /* Make selectable slots more obvious on touch devices */
        @media (max-width: 639px) {
          .rbc-day-bg.rbc-today {
            box-shadow: inset 0 0 0 2px #F59E0B;
          }
          
          /* Better touch interaction for calendar slots */
          .rbc-day-bg {
            cursor: pointer;
            -webkit-user-select: none;
            user-select: none;
          }
          
          .rbc-day-bg:active {
            background-color: rgba(232, 220, 196, 0.2);
          }
        }
        
        /* Improve touch selection feedback */
        .rbc-slot-selection {
          background-color: rgba(232, 220, 196, 0.4) !important;
          border: 2px solid #E8DCC4 !important;
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
        onSelectSlot={onSelectSlot}
        selectable={!!onSelectSlot}
        longPressThreshold={10}
        eventPropGetter={eventStyleGetter}
        popup
        style={{ height: '100%' }}
        step={30}
        timeslots={2}
      />
    </div>
  )
}
