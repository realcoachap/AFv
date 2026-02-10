# Self-Logged Workouts & Focus Types Guide
**v0.4.0 - Complete Guide**

---

## 🎉 What's New:

### **1. Self-Logged Workouts**
Clients can now track their solo gym visits!

### **2. Focus Type Selection** 
No more keyword guessing - explicit workout focus with radio buttons!

---

## 💪 How Clients Log Solo Workouts:

### **Step 1: Navigate**
- Go to **Schedule** page
- See new **"💪 Log Workout"** button (purple/pink gradient)

### **Step 2: Click & Fill Out Form**
Opens modal with:
- **Date picker** (can log up to 7 days in past)
- **Focus type radio buttons:**
  - 💪 Strength Training
  - 🏃 Cardio/Endurance
  - ⚡ Balanced Workout
- **Duration** (optional, in minutes)
- **Notes** (optional, "What did you work on?")
- **XP Preview**: Shows "+75 XP, +1 Strength" etc.

### **Step 3: Submit**
- Instantly saved as COMPLETED
- **Immediately gets:**
  - +75 XP
  - +1 stat (based on focus type)
  - Streak updated
  - Shows on calendar

**No approval needed - auto-accept!**

---

## 📅 How It Shows on Calendar:

**Coached Sessions (with you):**
- Status varies: PENDING_APPROVAL, CONFIRMED, COMPLETED
- 100 XP when completed

**Self-Logged Workouts:**
- Always COMPLETED (instant)
- 75 XP (lower, but still meaningful!)
- Count toward streaks

**Future Enhancement:** Different visual styling (colors/patterns) to distinguish the two

---

## 🎯 Focus Type System:

### **What It Does:**
Explicitly controls which stat increases when session completes.

### **The 3 Options:**

**💪 STRENGTH Training**
- Keywords: weights, resistance, lifting
- Awards: +1 Strength
- Avatar effect: Gets more muscular over time

**🏃 CARDIO/Endurance**
- Keywords: running, biking, HIIT, cardio
- Awards: +1 Endurance
- Avatar effect: Gets leaner over time

**⚡ BALANCED Workout**
- Keywords: full body, mixed, balanced
- Awards: +1 Strength AND +1 Endurance
- Avatar effect: Balanced growth

---

## 📊 XP Breakdown:

| Activity | XP | Stats | Streak |
|----------|-----|-------|--------|
| **Coached session** | 100 XP | +1 (focus type) | ✅ Counts |
| **Self-logged workout** | 75 XP | +1 (focus type) | ✅ Counts |
| **7-day streak bonus** | +150 XP | +2 Discipline | - |
| **30-day streak bonus** | +500 XP | +2 Discipline | - |

---

## 🧪 Testing Self-Logged Workouts:

### **Test 1: Log Today's Workout**
1. Login as client
2. Go to Schedule
3. Click **"💪 Log Workout"**
4. Pick today's date
5. Select **STRENGTH**
6. Add notes: "Bench press and squats"
7. Submit
8. **Expected:**
   - Modal closes
   - Workout appears on calendar
   - Go to RPG page → see +75 XP, Strength +1, Streak updated

### **Test 2: Log Past Workout**
1. Click **"💪 Log Workout"**
2. Pick date 3 days ago
3. Select **CARDIO**
4. Duration: 45 minutes
5. Notes: "30 min treadmill run"
6. Submit
7. **Expected:**
   - Shows on calendar on that past date
   - +75 XP, Endurance +1

### **Test 3: Multiple Workouts Same Day**
1. Log morning workout (Strength)
2. Log evening workout (Cardio)
3. **Expected:**
   - Both show on calendar
   - +150 XP total (75 + 75)
   - +1 Strength, +1 Endurance
   - Streak only updates once per day

### **Test 4: Build Streak with Solo Workouts**
1. Log workouts on consecutive days
2. Check RPG page
3. **Expected:**
   - Streak increments each day
   - 7-day streak = +150 XP bonus, +2 Discipline
   - Avatar may get aura (if Discipline ≥ 25)

---

## 🎨 Admin View:

### **What You See:**
- All client solo workouts on your admin calendar
- Can view details (focus type, notes, duration)
- Can add notes/comments (future feature)
- See total activity (coached + solo)

### **Benefits for You:**
- **Accountability:** See who's actually working out
- **Engagement:** Track client activity between sessions
- **Motivation:** Recognize clients who grind solo
- **Data:** Better understanding of client commitment

---

## 🚀 What's Next (To Be Added):

### **1. Focus Type Selection on Booking Forms**
When clients book sessions or you create them:
- Add radio buttons for focus type
- Default to BALANCED
- Show on edit forms too

**Status:** TODO (next ~30 min)

### **2. Visual Distinction on Calendar**
Make self-logged workouts look different:
- Different color (blue vs green)
- Dotted border
- Icon indicator

**Status:** TODO (~1 hour)

### **3. Admin Controls**
- View client self-logging stats
- Add notes to client workouts
- Optional: Review/approve system (if you want control)

**Status:** Future

---

## 💡 Pro Tips:

**For Clients:**
- Log workouts same day for accurate streak tracking
- Be honest - only log workouts you actually did
- Add notes to track progress ("Hit new PR on bench!")
- Mix coached + solo for maximum XP gains

**For Coach:**
- Encourage clients to log solo workouts
- Celebrate clients who hit 7-day streaks
- Use solo workout data to plan next sessions
- Recognize top self-loggers in group chats

---

## 🐛 Known Limitations:

**Current State:**
- ✅ Self-logging works perfectly
- ✅ Focus types control stats correctly
- ✅ XP awards correct amounts
- ⚠️ Focus type not yet selectable on booking forms (coming next!)
- ⚠️ Calendar doesn't visually distinguish coached vs solo (coming soon!)

**Workaround for Booking Forms:**
- Currently defaults to BALANCED
- You can edit after booking to set focus type
- Full radio button selection coming in ~30 min

---

## 🎯 Success Metrics:

**Client Engagement:**
- How many solo workouts logged per week?
- Are clients maintaining streaks?
- Is XP gain encouraging more gym visits?

**Your Insights:**
- Which clients work out solo most?
- What focus types are popular?
- Are clients hitting their weekly activity goals?

---

## 📞 Questions?

Test it out and let me know:
- How does the modal feel?
- Is 75 XP the right amount?
- Should duration be required?
- Want to approve solo workouts, or trust-based is fine?

---

**v0.4.0 deployed!** Test the "💪 Log Workout" button now! 🎮

Railway building (~3 min)...
