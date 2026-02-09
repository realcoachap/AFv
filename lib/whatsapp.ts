/**
 * WhatsApp Messaging via Twilio
 * 
 * Send WhatsApp messages to clients
 */

interface SendMessageParams {
  to: string // Phone number (E.164 format: +15551234567)
  message: string
}

export async function sendWhatsAppMessage({ to, message }: SendMessageParams) {
  // Get Twilio credentials from environment
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER // Format: whatsapp:+14155238886
  
  if (!accountSid || !authToken || !fromNumber) {
    console.warn('⚠️  Twilio credentials not configured. Message not sent.')
    return {
      success: false,
      error: 'WhatsApp not configured. Please add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER to environment variables.',
      dryRun: true,
    }
  }

  try {
    // Format phone number for WhatsApp (add whatsapp: prefix)
    const toWhatsApp = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`
    
    // Twilio API call
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: toWhatsApp,
        Body: message,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ WhatsApp message sent:', data.sid)
      return {
        success: true,
        messageId: data.sid,
        status: data.status,
      }
    } else {
      console.error('❌ Twilio error:', data)
      return {
        success: false,
        error: data.message || 'Failed to send message',
        code: data.code,
      }
    }
  } catch (error) {
    console.error('❌ WhatsApp send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Format phone number to E.164 format
 * Examples:
 * - "3057840724" -> "+13057840724" (assumes US)
 * - "+13057840724" -> "+13057840724" (already formatted)
 * - "305-784-0724" -> "+13057840724" (removes dashes)
 */
export function formatPhoneNumber(phone: string, defaultCountryCode = '+1'): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // If already has country code (11+ digits), add + prefix
  if (cleaned.length >= 11) {
    return `+${cleaned}`
  }
  
  // Otherwise, add default country code (US)
  return `${defaultCountryCode}${cleaned}`
}
