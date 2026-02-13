#!/usr/bin/env node
/**
 * Session Reminder Script
 *
 * Checks for upcoming sessions and sends WhatsApp reminders:
 * - 24 hours before: "Tomorrow at [time]"
 * - 1 hour before: "Starting in 1 hour"
 *
 * Runs via OpenClaw cron every 30 minutes
 */

import { prisma } from '../lib/prisma'

// Reminder windows (in milliseconds)
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000
const ONE_HOUR = 60 * 60 * 1000
const REMINDER_WINDOW = 30 * 60 * 1000 // 30-minute window for checking

interface ReminderSession {
  id: string
  dateTime: Date
  sessionType: string
  location: string | null
  client: {
    clientProfile: {
      fullName: string
      phone: string
    } | null
  }
  whatsappNotificationSent: boolean
  whatsappReminderSent: boolean
}

async function sendSessionReminders() {
  const now = new Date()

  // Find sessions in the next 24 hours + 30 min window (for 24h reminder)
  const twentyFourHoursFromNow = new Date(now.getTime() + TWENTY_FOUR_HOURS)
  const twentyFourHoursWindow = new Date(twentyFourHoursFromNow.getTime() + REMINDER_WINDOW)

  // Find sessions in the next 1 hour + 30 min window (for 1h reminder)
  const oneHourFromNow = new Date(now.getTime() + ONE_HOUR)
  const oneHourWindow = new Date(oneHourFromNow.getTime() + REMINDER_WINDOW)

  // Get sessions needing 24-hour reminder
  const sessionsFor24hReminder = await prisma.appointment.findMany({
    where: {
      status: 'CONFIRMED',
      dateTime: {
        gte: twentyFourHoursFromNow,
        lte: twentyFourHoursWindow,
      },
      whatsappNotificationSent: false,
    },
    include: {
      client: {
        select: {
          clientProfile: {
            select: {
              fullName: true,
              phone: true,
            },
          },
        },
      },
    },
  })

  // Get sessions needing 1-hour reminder
  const sessionsFor1hReminder = await prisma.appointment.findMany({
    where: {
      status: 'CONFIRMED',
      dateTime: {
        gte: oneHourFromNow,
        lte: oneHourWindow,
      },
      whatsappReminderSent: false,
    },
    include: {
      client: {
        select: {
          clientProfile: {
            select: {
              fullName: true,
              phone: true,
            },
          },
        },
      },
    },
  })

  // Send 24-hour reminders
  for (const session of sessionsFor24hReminder) {
    await send24HourReminder(session as ReminderSession)
  }

  // Send 1-hour reminders
  for (const session of sessionsFor1hReminder) {
    await send1HourReminder(session as ReminderSession)
  }
}

async function send24HourReminder(session: ReminderSession) {
  const clientName = session.client.clientProfile?.fullName || 'there'
  const phone = session.client.clientProfile?.phone

  if (!phone) {
    return
  }

  const sessionDate = new Date(session.dateTime)
  const timeStr = sessionDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const sessionTypeLabels: Record<string, string> = {
    ONE_ON_ONE: '1-on-1 training',
    GROUP: 'group session',
    ASSESSMENT: 'assessment',
    CHECK_IN: 'check-in',
  }

  const sessionTypeStr = sessionTypeLabels[session.sessionType] || 'session'
  const locationStr = session.location || 'the gym'

  const message = `Hey ${clientName}! 💪\n\nReminder: ${sessionTypeStr} tomorrow at ${timeStr} @ ${locationStr}.\n\nSee you there! 🔥\n\n- Coach`

  // TODO: Send WhatsApp message via OpenClaw message tool
  // This will be called by the cron job which has access to message tool

  // Mark as sent
  await prisma.appointment.update({
    where: { id: session.id },
    data: { whatsappNotificationSent: true },
  })
}

async function send1HourReminder(session: ReminderSession) {
  const clientName = session.client.clientProfile?.fullName || 'there'
  const phone = session.client.clientProfile?.phone

  if (!phone) {
    return
  }

  const locationStr = session.location || 'the gym'

  const message = `Hey ${clientName}! 🔔\n\nSession starting in 1 hour @ ${locationStr}!\n\nSee you soon! 💪\n\n- Coach`

  // TODO: Send WhatsApp message via OpenClaw message tool

  // Mark as sent
  await prisma.appointment.update({
    where: { id: session.id },
    data: { whatsappReminderSent: true },
  })
}

// Run if called directly
if (require.main === module) {
  sendSessionReminders()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error:', error)
      process.exit(1)
    })
}

export { sendSessionReminders }
