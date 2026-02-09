import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendWhatsAppMessage, formatPhoneNumber } from '@/lib/whatsapp'

/**
 * POST /api/reminders/send
 * Manually send WhatsApp reminder for a session
 * Admin only
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { appointmentId, reminderType } = body

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID required' },
        { status: 400 }
      )
    }

    // Get appointment with client info
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
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

    if (!appointment) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const clientName = appointment.client.clientProfile?.fullName || 'there'
    const phone = appointment.client.clientProfile?.phone

    if (!phone) {
      return NextResponse.json(
        { error: 'Client has no phone number' },
        { status: 400 }
      )
    }

    // Format session details
    const sessionDate = new Date(appointment.dateTime)
    const timeStr = sessionDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    const dateStr = sessionDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })

    const sessionTypeLabels: Record<string, string> = {
      ONE_ON_ONE: '1-on-1 training',
      GROUP: 'group session',
      ASSESSMENT: 'assessment',
      CHECK_IN: 'check-in',
    }

    const sessionTypeStr = sessionTypeLabels[appointment.sessionType] || 'session'
    const locationStr = appointment.location || 'the gym'

    // Build message based on reminder type
    let message = ''
    if (reminderType === '24h') {
      message = `Hey ${clientName}! 💪\n\nReminder: ${sessionTypeStr} tomorrow at ${timeStr} @ ${locationStr}.\n\nSee you there! 🔥\n\n- Coach`
    } else if (reminderType === '1h') {
      message = `Hey ${clientName}! 🔔\n\nSession starting in 1 hour @ ${locationStr}!\n\nSee you soon! 💪\n\n- Coach`
    } else {
      // Default: general reminder
      message = `Hey ${clientName}! 📅\n\nReminder: ${sessionTypeStr} on ${dateStr} at ${timeStr} @ ${locationStr}.\n\nLooking forward to it! 💪\n\n- Coach`
    }

    // Send WhatsApp message
    const formattedPhone = formatPhoneNumber(phone)
    const result = await sendWhatsAppMessage({
      to: formattedPhone,
      message,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Reminder sent successfully! ✅',
        messageText: message,
        phone: formattedPhone,
        messageId: result.messageId,
      })
    } else if (result.dryRun) {
      // Not configured yet - return instructions
      return NextResponse.json({
        success: false,
        dryRun: true,
        error: result.error,
        message,
        phone: formattedPhone,
        instructions: 'To enable WhatsApp reminders, add these environment variables in Railway:\n\n• TWILIO_ACCOUNT_SID\n• TWILIO_AUTH_TOKEN\n• TWILIO_WHATSAPP_NUMBER\n\nGet them from: https://console.twilio.com',
      }, { status: 200 })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to send message',
        message,
        phone: formattedPhone,
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Send reminder error:', error)
    return NextResponse.json(
      { error: 'Failed to prepare reminder' },
      { status: 500 }
    )
  }
}
