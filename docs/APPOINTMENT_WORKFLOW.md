# Appointment Booking & Approval Workflow

This document describes how appointment booking and approval works in the system.

---

## 🔄 Two Booking Methods

### 1. **Client Self-Booking** (Requires Approval)
- Client logs in and selects available time slot
- Status: `PENDING_APPROVAL`
- Coach receives notification (WhatsApp + dashboard alert)
- Coach can:
  - **Approve** → Status changes to `CONFIRMED`, client gets WhatsApp notification
  - **Reject** → Status changes to `REJECTED`, client gets notification with optional reason
  - **Reschedule** → Suggest different time (future feature)

### 2. **Admin-Created Booking** (Auto-Confirmed)
- Coach logs in and creates appointment directly
- Selects client, date, time
- Status: `CONFIRMED` (skips approval step)
- Client receives WhatsApp notification immediately

---

## 📊 Appointment Status Flow

```
┌─────────────────────────────────────────────────────┐
│                 CLIENT SELF-BOOKS                   │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
                 PENDING_APPROVAL
                         │
        ┌────────────────┼────────────────┐
        │                                 │
        ▼                                 ▼
    CONFIRMED                         REJECTED
        │                             (end state)
        │
        ▼
    [Session happens]
        │
        ▼
    COMPLETED
    (end state)


┌─────────────────────────────────────────────────────┐
│                  ADMIN CREATES                      │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
                    CONFIRMED
                         │
        ┌────────────────┼────────────────┐
        │                                 │
        ▼                                 ▼
   [Session happens]               CANCELLED
        │                           (end state)
        ▼
    COMPLETED
    (end state)


┌─────────────────────────────────────────────────────┐
│              EITHER PATH CAN ALSO:                  │
└─────────────────────────────────────────────────────┘
    CONFIRMED → NO_SHOW (client didn't show up)
```

---

## 🎯 Status Definitions

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **PENDING_APPROVAL** | Client booked, waiting for admin | System (when client books) |
| **CONFIRMED** | Appointment is confirmed, both parties agree | Admin (approval) or System (admin creates) |
| **COMPLETED** | Session finished successfully | Admin (after session) |
| **CANCELLED** | Either party cancelled | Admin or Client |
| **REJECTED** | Admin declined the booking request | Admin |
| **NO_SHOW** | Client didn't show up for confirmed appointment | Admin |

---

## 🔔 Notifications

### When Client Books (PENDING_APPROVAL):
- **To Admin (Coach):**
  - WhatsApp: "New booking request from [Client Name] for [Date/Time]"
  - Dashboard: Badge count on "Pending Approvals" tab
  - Email (optional, future feature)

### When Admin Approves (CONFIRMED):
- **To Client:**
  - WhatsApp: "Your appointment on [Date/Time] has been confirmed!"
  - Dashboard: Shows in "Upcoming Appointments"

### When Admin Rejects (REJECTED):
- **To Client:**
  - WhatsApp: "Your booking request for [Date/Time] was declined. [Optional reason]"
  - Dashboard: Shows in "Past Requests" with rejection reason

### When Admin Creates (CONFIRMED):
- **To Client:**
  - WhatsApp: "New appointment scheduled for [Date/Time]"
  - Dashboard: Shows in "Upcoming Appointments"

### Reminder (24 hours before):
- **To Both:**
  - WhatsApp: "Reminder: Appointment tomorrow at [Time]"

---

## 🖥️ Admin Dashboard Features

### Pending Approvals Tab
Shows all `PENDING_APPROVAL` appointments:
- Client name
- Requested date/time
- Client's notes (why they want to book, any preferences)
- Quick actions: **Approve** | **Reject** | **View Profile**

### Calendar View
- Color-coded by status:
  - 🟡 Yellow: PENDING_APPROVAL
  - 🟢 Green: CONFIRMED
  - 🔵 Blue: COMPLETED
  - 🔴 Red: CANCELLED/REJECTED/NO_SHOW

### Quick Stats
- Total pending approvals
- Today's confirmed appointments
- This week's appointments
- No-show rate

---

## 👤 Client Dashboard Features

### Request New Appointment
1. Select date from calendar (shows available slots)
2. Select time (Coach's availability)
3. Choose duration (30, 60, 90 minutes)
4. Add optional notes ("First session", "Focus on upper body", etc.)
5. Submit → Status: PENDING_APPROVAL
6. See confirmation: "Request submitted! Coach will review shortly."

### My Appointments Tab
- **Pending:** Shows awaiting approval (with cancel option)
- **Upcoming:** Confirmed appointments (with cancel option, 24h+ notice required)
- **Past:** Completed sessions

### Notifications
- In-app notification badge
- WhatsApp messages

---

## 🛡️ Business Rules

### Booking Constraints
1. **Advance Notice:** Clients must book at least 24 hours in advance
2. **Cancellation Policy:** Can cancel up to 24 hours before (configurable)
3. **Max Pending:** Clients can have max 3 pending requests at once
4. **No Double-Booking:** Can't book slot already taken

### Admin Powers
- Coach can override any constraint
- Coach can create appointments in the past (for record-keeping)
- Coach can edit any appointment
- Coach can mark no-shows

### Time Slots
- Default: 1-hour sessions
- Options: 30 min, 60 min, 90 min
- Coach sets available hours (9 AM - 8 PM by default)
- Coach can block out unavailable times

---

## 🚀 Phase Implementation

### Phase 5 (Calendar & Scheduling):
- ✅ Admin can create appointments directly (CONFIRMED)
- ✅ Basic calendar view
- ✅ WhatsApp notifications

### Phase 6 (Client Self-Booking):
- ⏳ Client booking interface
- ⏳ Approval workflow UI for admin
- ⏳ Pending approvals dashboard
- ⏳ Status change notifications

### Future Enhancements:
- Recurring appointments (weekly standing bookings)
- Waitlist (if time slot is full)
- Automated reminders (24h, 1h before)
- Rescheduling requests (client proposes new time)
- Package deals (book 10 sessions at once)
- Payment integration (hold deposit when booking)

---

## 🔧 Database Fields

```prisma
model Appointment {
  status          AppointmentStatus  // Current state
  bookedBy        BookedBy           // CLIENT or ADMIN
  adminId         String?            // Null until approved
  clientNotes     String?            // Client's note when booking
  rejectionReason String?            // Admin's reason if rejected
  // ... other fields
}

enum AppointmentStatus {
  PENDING_APPROVAL
  CONFIRMED
  COMPLETED
  CANCELLED
  REJECTED
  NO_SHOW
}

enum BookedBy {
  CLIENT  // Self-booked (needs approval)
  ADMIN   // Admin created (auto-confirmed)
}
```

---

## 📱 WhatsApp Message Templates

### Client Books:
```
🗓️ New Booking Request

From: John Doe
Date: March 15, 2026
Time: 3:00 PM - 4:00 PM
Notes: First session, focus on weight loss

Reply:
1️⃣ Approve
2️⃣ Reject
```

### Admin Approves:
```
✅ Appointment Confirmed!

Date: March 15, 2026
Time: 3:00 PM - 4:00 PM
Duration: 60 minutes

See you there! 💪
```

### Admin Rejects:
```
❌ Booking Request Declined

Your request for March 15 at 3:00 PM was declined.
Reason: That time is no longer available. Please try another slot.

Book a new time: [link]
```

### Reminder:
```
⏰ Appointment Reminder

Tomorrow at 3:00 PM
Duration: 60 minutes

See you soon! Reply CANCEL to cancel.
```

---

**Document maintained by Vlad | Last updated: 2026-02-08**
