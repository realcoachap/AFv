# 🎉 Release v0.2.2 - Client Booking & Calculator Access

**Release Date:** February 9, 2026  
**Type:** Major Feature Addition  
**Status:** Deployed ✅

---

## 🎯 What's New for Clients

### 1. Interactive Calendar Booking 📅

Clients can now book sessions directly from the calendar!

**How It Works:**
- **Desktop:** Click any empty calendar slot
- **Mobile:** Tap empty slot OR use floating + button
- Select session type, duration, add notes
- Submit request → Auto-set to **PENDING_APPROVAL**
- Trainer receives notification in pending queue
- Client gets alert: "✅ Session request sent! Your trainer will confirm shortly."

**Benefits:**
- Self-service booking (reduces Coach's workload)
- Clients feel empowered to manage their schedule
- Still requires Coach approval (safety + control)
- Mobile-friendly with floating + button

---

### 2. Calorie Calculator Access 🔢

Clients now have their own calorie calculator!

**NEW PAGE:** `/client/calculator`

**Features:**
- Calculate BMR (Basal Metabolic Rate)
- Calculate TDEE (with activity level)
- Set goals: Fat Loss, Maintenance, Muscle Gain
- Get personalized macro breakdown (protein/carbs/fats)
- Client-focused copy: "Your Results", "Your Target", etc.
- Encouragement to share results with trainer

**Access:**
- Client Dashboard → "Calculator" (nav or card)
- Mobile responsive design
- Same calculations as admin version

---

## 🔄 Updated Features

### Client Dashboard
- ✅ Added logo to navigation bar
- ✅ Added "Calculator" link to nav
- ✅ Added Calculator card to dashboard grid
- ✅ Responsive navigation (compact on mobile)
- ✅ 3-card layout: Profile, Schedule, Calculator

### Client Schedule Page
- ✅ Calendar now clickable/tappable
- ✅ Floating + button on mobile
- ✅ Tip banner: "Tap empty slot or use + button to request"
- ✅ Session detail modal works (click existing events)

---

## 📊 Technical Details

### Client Session Requests

**API Endpoint:** `POST /api/schedule`

**Request Body:**
```json
{
  "dateTime": "2026-02-10T14:00:00.000Z",
  "duration": 60,
  "sessionType": "ONE_ON_ONE",
  "clientNotes": "Focus on upper body",
  "status": "PENDING_APPROVAL"
}
```

**Note:** `clientId` automatically set from session user

### Components Added
- `ClientQuickBookModal.tsx` - Client session request modal
- `/client/calculator/page.tsx` - Client calorie calculator page

### Files Modified
- Client schedule page (added booking functionality)
- Client dashboard (added calculator access + logo)

---

## 🧪 Testing Checklist

### Client Calendar Booking
- [ ] Log in as client
- [ ] Go to Schedule page
- [ ] See floating + button (mobile) or empty calendar slots (desktop)
- [ ] Click/tap empty slot → modal opens
- [ ] Fill in session details → Submit
- [ ] See success alert
- [ ] Session appears on calendar with yellow (PENDING_APPROVAL) color
- [ ] Admin sees request in "Pending Approvals" queue

### Client Calculator
- [ ] Log in as client
- [ ] Go to Dashboard
- [ ] Click "Calculator" (nav or card)
- [ ] Fill in age, gender, weight, height
- [ ] Select activity level and goal
- [ ] Click "Calculate"
- [ ] See BMR, TDEE, Target Calories
- [ ] See macro breakdown (protein/carbs/fats)
- [ ] Verify mobile responsive

---

## 💡 Usage Scenarios

### Client Self-Booking Flow
1. Client logs in
2. Views calendar, sees available times
3. Clicks empty slot (or + button on mobile)
4. Selects "1-on-1 Training", 60 min
5. Adds note: "Want to work on deadlifts"
6. Clicks "Request Session"
7. Gets confirmation alert
8. Session shows as "PENDING APPROVAL" (yellow)
9. Coach receives notification
10. Coach approves → session turns green (CONFIRMED)
11. Client receives WhatsApp reminder (if configured)

### Client Calculator Flow
1. Client goes to Dashboard
2. Clicks "Calculator"
3. Enters stats: 30 yrs, Male, 180 lbs, 72 inches
4. Selects "Moderate Activity"
5. Selects "Fat Loss"
6. Clicks "Calculate"
7. Sees: BMR 1800, TDEE 2790, Target 2290 cal
8. Sees macros: 164g protein, 257g carbs, 70g fats
9. Takes screenshot to share with Coach

---

## 🎨 Design Decisions

### Why PENDING_APPROVAL?
- Prevents scheduling conflicts
- Trainer controls final schedule
- Client still feels empowered
- Trainer can adjust timing/location before confirming

### Why Floating + Button?
- Mobile calendar tapping is tricky
- + button always works (reliable fallback)
- Familiar UX pattern (Gmail, messaging apps)
- Doesn't interfere with calendar viewing

### Why Client Calculator?
- Empowers clients to understand their nutrition
- Reduces repetitive calculations for Coach
- Encourages client engagement
- Clients can experiment with different goals

---

## 📈 Impact

**For Coach:**
- Fewer "Can I book a session?" messages
- Clients self-serve scheduling
- Pending queue shows all requests in one place
- Calculator tool for nutrition consultations

**For Clients:**
- Feel in control of their schedule
- Can book 24/7 (not waiting for Coach availability)
- Access to professional nutrition calculations
- More engaged with their fitness journey

---

## 🔄 Version History

| Version | Date | Key Features |
|---------|------|--------------|
| **v0.2.2** | Feb 9 | Client booking + calculator |
| v0.2.1.2 | Feb 9 | Admin calculator + mobile fix |
| v0.2.1.1 | Feb 9 | Mobile responsive improvements |
| v0.2.1-alpha | Feb 9 | Branding + interactive calendar |
| v0.2.0 | Feb 8 | Profile + scheduling system |

---

## 🚀 Deployment

**Branch:** main  
**Commit:** d3319f4  
**Tag:** v0.2.2  
**Railway:** Auto-deployed ✅  
**Live URL:** https://kind-charisma-production.up.railway.app

---

## 📝 Notes

- **No database migrations** - safe upgrade
- **Client sessions** default to PENDING_APPROVAL
- **Calculator uses** Mifflin-St Jeor equation (industry standard)
- **Mobile optimized** with floating button fallback
- **Backward compatible** - all existing features work

---

## 🎯 Next Steps

**Coach should test:**
1. Create a test client account (or use existing)
2. Try booking a session as client
3. Check admin pending approvals queue
4. Approve the test session
5. Try client calculator with sample data

**Future enhancements:**
- Email notifications when session approved/cancelled
- Push notifications (if mobile app)
- Recurring session requests
- Favorite time slots

---

**Status:** ✅ Live and ready!

Coach, **clients can now book sessions and use the calculator!** Test it out with a client account. 💪📱
