# Session Integration Testing Guide
**v0.3.2 - Auto XP/Stats/Streaks**

---

## 🎉 What Just Went Live:

**Sessions now automatically trigger RPG updates!**

When you mark a session as **COMPLETED**, the system automatically:
- ✅ Awards 100 XP to the client
- ✅ Increases Strength OR Endurance (based on session type)
- ✅ Updates streak counter
- ✅ Awards streak bonuses (7, 30, 90 days)
- ✅ Checks for level-ups
- ✅ Logs everything

**Client sees results instantly** when they refresh their RPG page!

---

## 🧪 How to Test (Step-by-Step):

### **Setup:**
1. Go to `/admin/rpg/demo`
2. Initialize an RPG character for a test client (if needed)
3. Note their current stats:
   - Level: ?
   - XP: ?
   - Strength: ?
   - Endurance: ?
   - Streak: ?

### **Test 1: Basic Session Completion**
1. Go to `/admin/schedule`
2. Find a session with that test client
3. Mark it as **COMPLETED**
4. Go back to `/admin/rpg/demo`
5. **Should see:**
   - ✅ +100 XP
   - ✅ +1 Strength (or Endurance, depending on session type)
   - ✅ Streak updated (if within 24 hours)

### **Test 2: Level Up**
1. Award enough XP to trigger a level (use demo buttons if needed)
2. Mark another session COMPLETED
3. **Should see:**
   - ✅ Client levels up!
   - ✅ XP bar progress
   - Level unlocks displayed (if at 5, 10, 15, 20)

### **Test 3: Streak System**
1. Mark a session COMPLETED today
2. Wait 1 day (or manually test with database)
3. Mark another session COMPLETED
4. **Should see:**
   - ✅ Streak counter increments (+1)
   - ✅ If 7-day streak: +150 XP bonus, +2 Discipline
   - ✅ If 30-day streak: +500 XP bonus
   - ✅ Avatar may get aura glow (if Discipline ≥ 25)

### **Test 4: Session Type Detection**
**Try different session types/notes:**

**Strength Session:**
- Session type: "ONE_ON_ONE"
- Notes: "Bench press, squats, deadlifts"
- **Expected:** +1 Strength

**Cardio Session:**
- Session type: "ONE_ON_ONE"
- Notes: "30 min treadmill run, HIIT cardio"
- **Expected:** +1 Endurance

**Balanced Session:**
- Session type: "ONE_ON_ONE"
- Notes: "Full body workout"
- **Expected:** +1 Strength, +1 Endurance

### **Test 5: Client View**
1. Login as the test client
2. Go to `/client/rpg`
3. **Should see:**
   - ✅ Updated level/XP
   - ✅ Updated stats (Strength/Endurance bars)
   - ✅ Updated streak counter
   - ✅ Avatar appearance (if stats changed significantly)

---

## 🔍 Where to Look:

### **Admin Side:**
- `/admin/rpg/demo` - See all client stats in real-time
- `/admin/schedule` - Mark sessions complete here

### **Client Side:**
- `/client/rpg` - Client sees their character with updated stats

### **Database Logs:**
- `RPGXPLog` table - All XP transactions recorded
- `RPGCharacter` table - Current stats, level, streak

---

## 🎯 Expected Results:

**After 1 Session:**
- Level: 1 → 1 or 2 (depends on starting XP)
- XP: +100
- Strength OR Endurance: +1
- Streak: 0 → 1 (first workout)

**After 5 Sessions (same week):**
- Level: ~2-3
- XP: ~500+
- Strength/Endurance: ~5-10 (combined)
- Streak: 5 days

**After 7 Sessions (consecutive days):**
- Level: ~3-4
- XP: ~850+ (includes 7-day bonus)
- Discipline: +2 (from streak)
- **Avatar gets faint aura glow** 🔥

**After 30 Sessions (1 month, consistent):**
- Level: ~10-15
- XP: ~3500+
- Stats: Strength/Endurance at 20-30+
- Discipline: 15-20+
- **Avatar looks noticeably different:**
  - More muscular (if strength focus)
  - Leaner (if cardio focus)
  - Glowing aura (from discipline)

---

## 🐛 Troubleshooting:

**Stats not updating?**
- Check session status is COMPLETED (not CONFIRMED)
- Check RPG character exists (use demo to initialize)
- Check console logs in Railway

**Streak not continuing?**
- Streak requires sessions within 24 hours
- If gap > 1 day, streak resets to 1

**Avatar not changing?**
- Stats need to reach thresholds:
  - Strength 25+ = visible muscle definition
  - Endurance 25+ = lean build
  - Discipline 25+ = faint aura glow
- Try awarding more XP/sessions to reach thresholds

**Level-up not showing?**
- Client needs to refresh `/client/rpg` page
- Check XP log to confirm XP was awarded

---

## 📊 Session Type Keywords:

**Strength Keywords** (in sessionType or notes):
- "strength", "weights", "resistance", "lifting"
- "bench", "squat", "deadlift", "press"
- **Result:** +1 Strength

**Cardio Keywords** (in sessionType or notes):
- "cardio", "running", "endurance", "hiit"
- "treadmill", "bike", "elliptical", "sprint"
- **Result:** +1 Endurance

**Balanced/Other:**
- No specific keywords, or mixed workout
- **Result:** +1 Strength, +1 Endurance

---

## 🎮 Quick Test Scenario:

**Goal:** See avatar evolution in action

1. **Initialize character** for test client (demo page)
2. **Award 500 XP** manually (demo page) → gets to ~Level 5-6
3. **Mark 25 sessions complete** over time (or use demo to award XP/stats)
4. **Set Strength to 30** (need admin tool or DB)
5. **Refresh client RPG page**
6. **See:** Muscular avatar with visible definition!

---

## 💡 Pro Tips:

1. **Use notes field** to specify workout type (e.g., "Leg day - squats, lunges")
2. **Streaks drive Discipline**, which creates the aura glow effect
3. **Balanced sessions** = best for overall power level growth
4. **Level 5, 10, 15, 20** unlock new cosmetics (future customization)

---

## 🚀 What's Next:

After you test and confirm this works:

1. **Quest System** - Daily/weekly quests for bonus XP
2. **Leaderboards** - See top clients competing
3. **Achievement Badges** - Unlock badges for milestones
4. **Avatar Customization UI** - Let clients change hair, outfit, accessories
5. **Enhanced Avatars** - More detailed designs, more options

---

**Ready to test? Mark a session complete and watch the magic happen!** 🎮💪
